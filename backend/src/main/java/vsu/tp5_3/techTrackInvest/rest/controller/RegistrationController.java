package vsu.tp5_3.techTrackInvest.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import vsu.tp5_3.techTrackInvest.dto.AppErrorDto;
import vsu.tp5_3.techTrackInvest.dto.RegistrationDto;
import vsu.tp5_3.techTrackInvest.dto.RegistrationResponse;
import vsu.tp5_3.techTrackInvest.dto.UserReadDto;
import vsu.tp5_3.techTrackInvest.service.implementations.EmailMailingService;
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
    private final EmailMailingService emailMailingService;

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
        UserReadDto userReadDto = userService.create(registrationDto);
        System.out.println("gdfgdfg");
        UserDetails userDetails = userService.loadUserByUsername(userReadDto.getEmail());
        System.out.println(userDetails.getUsername());

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

    @PostMapping("/token")
    public ResponseEntity<?> getToken(@RequestParam String email) {
        emailMailingService.getRegistrationToken(email);
        return ResponseEntity.ok("Токен отправлен на электронную почту");
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(
            @RequestParam String email,
            @RequestParam String token) {

        boolean isValid = emailMailingService.validateToken(email, token);

        if (isValid) {
            return ResponseEntity.ok("Токен валиден");
        } else {
            return ResponseEntity.badRequest().body("Токен не валиден");
        }
    }
}
