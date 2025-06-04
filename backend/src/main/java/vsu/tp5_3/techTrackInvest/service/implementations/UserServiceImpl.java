package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import vsu.tp5_3.techTrackInvest.annotation.Tested;
import vsu.tp5_3.techTrackInvest.dto.*;
import vsu.tp5_3.techTrackInvest.entities.mongo.NicheMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.*;
import vsu.tp5_3.techTrackInvest.exceptions.SessionNotFoundException;
import vsu.tp5_3.techTrackInvest.exceptions.UserNotFoundException;
import vsu.tp5_3.techTrackInvest.mapper.UserCreateEditMapper;
import vsu.tp5_3.techTrackInvest.mapper.UserProfileMapper;
import vsu.tp5_3.techTrackInvest.mapper.UserReadMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.NicheMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;


import java.util.*;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserDetailsService, UserService {
    private final UserRepository userRepository;
    private final UserCreateEditMapper userCreateEditMapper;
    private final UserReadMapper userReadMapper;
    private final PasswordEncoder passwordEncoder;
    private final NicheMongoRepository nicheMongoRepository;
    private final UserProfileMapper userProfileMapper;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);



    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(
                String.format("Пользователь '%s' не найден", username)
        ));
        String role = "ROLE_USER";
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singleton(new SimpleGrantedAuthority(role))
        );
    }

    @Transactional
    public UserReadDto create(RegistrationDto registrationDto) {
        // какие-то логичные ошибки если такой же логин или почта
        String hashedPassword = passwordEncoder.encode(registrationDto.getPassword());
        registrationDto.setPassword(hashedPassword);
        UserReadDto userReadDto = Optional.ofNullable(registrationDto)
                .map(userCreateEditMapper::map)
                .map(userRepository::saveAndFlush)
                .map(userReadMapper::map)
                .orElseThrow();

        return userReadDto;
    }

    @Tested
    @Override
    public Optional<MoneyDto> getMoney() {
        // Получаем монетки пользователя
        // Получаем из сессии
        // Получаем пользователя
//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
//        Session session = userRepository.findByEmail(email).orElseThrow().getSessions().getLast();
        Session session = getUserDBSession();
        //суммарная стоимость стартапов
        double totalStartupsCost = session.getStartups().stream().mapToDouble(Startup::getSalePrice).sum();

        //получаем сколько у игрока денег нужно скопировать как я понял, на всякий случай
        List<Step> steps = new ArrayList<>(session.getSteps());
        steps.sort(Comparator.comparing(Step::getSequenceNumber));
        int playerCash = steps.getLast().getCash();

        //всё складываем что есть в dto
        return Optional.of(new MoneyDto((double) playerCash, totalStartupsCost, playerCash
                + totalStartupsCost));
    }

    @Tested
    @Transactional
    @Override
    public Optional<ReputationDto> getReputation() {
        //получаем пользователя и находим сессию
        Session session = getUserDBSession();

        //получаем состояние репутации на последний ход
        return session.getSteps().stream()
                .max(Comparator.comparing(Step::getSequenceNumber))
                .map(value -> new ReputationDto(value.getReputation()));

    }

    @Tested
    @Override
    public Optional<ExpertiseDto> getExpertise() {
        //получаем названия категорий из монго(it и вся хрень)
        List<NicheMongo> nicheMongoList = nicheMongoRepository.findAll();
        //теперь получаем показатели экспертизы из постгреса
        Session session = getUserDBSession();
        Step currentStep =  session.getSteps().stream()
                .max(Comparator.comparing(Step::getSequenceNumber)).get();
        List<Expertise> currentPlayerExpertise = currentStep.getExpertiseList();
        Map<String, Integer> resultExpertise = new HashMap<>();
        //сравниваем resource id эксперитзы, которые хранятся в постресе с id из монго, чтобы получить названия категорий
        for (Expertise expertise : currentPlayerExpertise) {
            resultExpertise.put(expertise.getResourceId(), expertise.getValue());
        }
        return Optional.of(new ExpertiseDto(resultExpertise));
    }

    public Optional<AppUser> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public boolean updatePassword(String email, String newPassword) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    user.setPasswordHash(passwordEncoder.encode(newPassword));
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    @Tested
    @Override
    public Session getUserDBSession() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Получаем пользователя с почтой {}", email);
        AppUser user = userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
        logger.info("Получили пользователя с ником {}", user.getUsername());
        List<Session> sessions = user.getSessions();
        logger.info("Получили все сессии пользователя");
        if (sessions == null || sessions.isEmpty()) {
            logger.info("У пользователя нет активных сессий. Ник пользователя {}", user.getUsername());
            throw new SessionNotFoundException("У пользователя %s нет активных сессий".formatted(user.getUsername()));
        }
        return sessions.getLast();
    }

    public Optional<UserProfileDto> getProfile() {
        AppUser user = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow();
        return Optional.ofNullable(userProfileMapper.map(user));
    }

    /** Нормально вернуть ошибку что он занят */
    @Transactional
    public Optional<UserProfileDto> changeEmail(String email) {
        AppUser user = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));

        if (user.getEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Новый email должен отличаться от текущего"
            );
        }

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Этот email уже используется другим пользователем"
            );
        }

        user.setEmail(email);
        userRepository.save(user);

        return Optional.ofNullable(userProfileMapper.map(user));
    }

    @Transactional
    @Override
    public Optional<UserProfileDto> changeUsername(String username) {
        AppUser user = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));

        if (user.getUsername().equals(username)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Новый username должен отличаться от текущего"
            );
        }

        if (userRepository.existsByUsername(username)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Этот username уже занят"
            );
        }

        user.setUsername(username);
        userRepository.save(user);
        return Optional.ofNullable(userProfileMapper.map(user));
    }

    @Transactional
    @Override
    public Optional<UserProfileDto> changePassword(String password) {
        String hashedPassword = passwordEncoder.encode(password);
        AppUser user = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow();
        user.setPasswordHash(hashedPassword);
        userRepository.save(user);
        return Optional.ofNullable(userProfileMapper.map(user));
    }

    public boolean checkUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean checkMailExists(String mail) {
        return userRepository.existsByEmail(mail);
    }
}
