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
import vsu.tp5_3.techTrackInvest.dto.ExpertiseDto;
import vsu.tp5_3.techTrackInvest.dto.MoneyDto;
import vsu.tp5_3.techTrackInvest.dto.RegistrationDto;
import vsu.tp5_3.techTrackInvest.dto.ReputationDto;

import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;
import vsu.tp5_3.techTrackInvest.mock.mockRepository.MockUserRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserDetailsService, UserService {
    //private final UserRepository userRepository;
    private final MockUserRepository mockUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = mockUserRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(
                String.format("Пользователь '%s' не найден", username)
        ));
        String role = "ROLE_USER";
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singleton(new SimpleGrantedAuthority(role))
        );
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

    @Transactional
    public boolean create(RegistrationDto registrationDto) {
        String hashedPassword = passwordEncoder.encode(registrationDto.getPassword());
        registrationDto.setPassword(hashedPassword);
        return mockUserRepository.save(registrationDto);
        /**
         * Адекватный вид
         * return Optional.ofNullable(registrationDto)
         *             .map(dto -> {
         *                 String hashedPassword = passwordEncoder.encode(dto.getPassword());
         *                 dto.setPassword(hashedPassword);
         *                 return registrationMapper.map(dto);
         *             })
         *             .map(userRepository::save)
         *             .map(userReadMapper::map)
         *             .orElseThrow();
         * */
    }

    /** Возвращать в дальнейшем надо нормальный опшионал юзер дто */
    public RegistrationDto findByEmail(String email) {
        return mockUserRepository.findByEmail(email) != null ? new RegistrationDto() : null;
    }


}
