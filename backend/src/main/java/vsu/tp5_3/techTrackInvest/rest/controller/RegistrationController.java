package vsu.tp5_3.techTrackInvest.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import vsu.tp5_3.techTrackInvest.dto.AppErrorDto;
import vsu.tp5_3.techTrackInvest.dto.RegistrationDto;
import vsu.tp5_3.techTrackInvest.dto.RegistrationResponse;
import vsu.tp5_3.techTrackInvest.dto.UserReadDto;
import vsu.tp5_3.techTrackInvest.service.implementations.UserServiceImpl;
import vsu.tp5_3.techTrackInvest.utils.JwtTokenUtils;

@Tag(name = "Регистрация", description = "регистрация нового пользователя с уникальной почтой и ником")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user/registration")
public class RegistrationController {
    private final UserServiceImpl userService;
    private final JwtTokenUtils jwtTokenUtils;
    private final AuthenticationManager authenticationManager;

    @Operation(
            summary = "Регистрация",
            description = "Необходимо для начала игры"
    )
    @PostMapping
    public ResponseEntity<RegistrationResponse> createNewUser(@RequestBody RegistrationDto registrationDto) {
        userService.findByEmail(registrationDto.getEmail())
                .ifPresent(user -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Пользователь с таким email уже существует"
                    );
                });
        // Сохраняем пользователя (userService.create() уже хеширует пароль)
        UserReadDto userReadDto = userService.create(registrationDto);
        System.out.println("gdfgdfg");

        /*authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                registrationDto.getEmail(),
                registrationDto.getPassword()));*/
        System.out.println("kkkkk");
        // Аутентификация через UserDetails (без вызова authenticationManager)
        UserDetails userDetails = userService.loadUserByUsername(userReadDto.getEmail());
        System.out.println(userDetails.getUsername());

        // Генерация токена
        String token = jwtTokenUtils.generateToken(userDetails);

        System.out.println("Token: " + token);
        System.out.println("User: " + userDetails.getUsername() + " | " + userDetails.getPassword());
        return ResponseEntity.ok(new RegistrationResponse(
                userReadDto.getUsername(),
                userReadDto.getEmail(),
                userReadDto.getSessions(),
                userReadDto.getRegistrationDate(),
                userReadDto.getLevel(),
                userReadDto.getBalance(),
                token
        ));
    }
}
