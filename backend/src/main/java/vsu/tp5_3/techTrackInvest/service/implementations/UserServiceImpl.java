package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.annotation.NeedTest;
import vsu.tp5_3.techTrackInvest.dto.*;
import vsu.tp5_3.techTrackInvest.entities.mongo.NicheMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.*;
import vsu.tp5_3.techTrackInvest.mapper.UserCreateEditMapper;
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
        return Optional.ofNullable(registrationDto)
                .map(userCreateEditMapper::map)
                .map(userRepository::save)
                .map(userReadMapper::map)
                .orElseThrow();
    }

    @NeedTest
    @Override
    public Optional<MoneyDto> getMoney() {
        // Получаем монетки пользователя
        // Получаем из сессии
        // Получаем пользователя
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Session session = userRepository.findByEmail(email).orElseThrow().getSessions().getLast();

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

    @NeedTest
    @Transactional
    @Override
    public Optional<ReputationDto> getReputation() {
        //получаем пользователя и находим сессию
        Session session = getCurrentDBSession();

        //получаем состояние репутации на последний ход
        return session.getSteps().stream()
                .max(Comparator.comparing(Step::getSequenceNumber))
                .map(value -> new ReputationDto(value.getReputation()));

    }

    @NeedTest
    @Override
    public Optional<ExpertiseDto> getExpertise() {
        //получаем названия категорий из монго(it и вся хрень)
        List<NicheMongo> nicheMongoList = nicheMongoRepository.findAll();
        //теперь получаем показатели экспертизы из постгреса
        Session session = getCurrentDBSession();
        Step currentStep =  session.getSteps().stream()
                .max(Comparator.comparing(Step::getSequenceNumber)).get();
        List<Expertise> currentPlayerExpertise = currentStep.getExpertiseList();
        Map<String, Integer> resutlExpertise = new HashMap<>();
        //сравниваем resource id эксперитзы, которые хранятся в постресе с id из монго, чтобы получить названия категорий
        for (Expertise expertise : currentPlayerExpertise) {
            for (NicheMongo nicheMongo : nicheMongoList) {
                if (expertise.getResourceId().equals(nicheMongo.getId())) {
                    resutlExpertise.put(nicheMongo.getName(), expertise.getValue());
                    break;
                }
            }
        }
        return Optional.of(new ExpertiseDto(resutlExpertise));
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

    @NeedTest
    private Session getCurrentDBSession() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow().getSessions().getLast();
    }
}
