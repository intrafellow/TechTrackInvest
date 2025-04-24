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
import vsu.tp5_3.techTrackInvest.dto.*;
import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;
import vsu.tp5_3.techTrackInvest.mapper.UserCreateEditMapper;
import vsu.tp5_3.techTrackInvest.mapper.UserReadMapper;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserDetailsService, UserService {
    private final UserRepository userRepository;
    private final UserCreateEditMapper userCreateEditMapper;
    private final UserReadMapper userReadMapper;
    private final PasswordEncoder passwordEncoder;

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

    @Override
    public Optional<MoneyDto> getMoney() {
        // Получаем монетки пользователя
        // Получаем из сессии
        // Получаем пользователя
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        // UserRepository.findSession().getStepCount().get().cash
        // Посчитать сумму купленных стартапов
        // Вычесть всякое
        Optional<MoneyDto> moneyDto = Optional.of(new MoneyDto((double) 100.0, 80.0, 180.0));
        return moneyDto;
    }

    @Override
    public Optional<ReputationDto> getReputation() {
        return Optional.of(new ReputationDto(100));
    }

    @Override
    public Optional<ExpertiseDto> getExpertise() {
        return Optional.of(new ExpertiseDto(Map.of("IT", 100,
                "GreenTech", 10,
                "MedTech", 80,
                "SpaceTech", 50)));
    }

    /** Возвращать в дальнейшем надо нормальный опшионал юзер дто */
    public Optional<AppUser> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

}
