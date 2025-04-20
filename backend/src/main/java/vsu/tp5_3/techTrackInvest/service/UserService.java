package vsu.tp5_3.techTrackInvest.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.RegistrationDto;
import vsu.tp5_3.techTrackInvest.entities.AppUser;
import vsu.tp5_3.techTrackInvest.mock.mockRepository.MockUserRepository;
import vsu.tp5_3.techTrackInvest.repositories.UserRepository;

import java.util.Collections;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService implements UserDetailsService {
    //private final UserRepository userRepository;
    private final MockUserRepository mockUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println(username);
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
