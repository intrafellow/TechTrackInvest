package vsu.tp5_3.techTrackInvest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
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

    @Operation(
            summary = "Метод для отправки токена на почту для регистрации",
            description = "Отправляет цифровой код на почту игрока для подтверждения владения ею",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Уникальный правильный email, на который отправлен токен"),
                    @ApiResponse(responseCode = "409", description = "Пользователь с таким email уже существует в системе")
            }
    )
    @PostMapping("/token")
    public ResponseEntity<?> getToken(@RequestParam String email) {
        if (userService.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Пользователь с таким email уже существует");
        }
        emailMailingService.getRegistrationToken(email);
        return ResponseEntity.ok("Токен отправлен на электронную почту");
    }

    @Operation(
            summary = "Сверяем введённый пользователем токен, с тем что был выслан ему на почту",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Токены совпадают. Успешная регистрация почты"),
                    @ApiResponse(responseCode = "400", description = "Токены различаются")
            }
    )
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

    @Operation(
            summary = "Проверяем есть ли пользователь с таким юзернеймом",
            description = "Если данный юзерней доступен для регистрации то возвращаем true, иначе - false",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Запрос всегда возвращает 200 код, только если сервер не поломался",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "boolean",
                                            description = "true - юзернейм доступен, false - уже занят"
                                    )
                            )
                    )
            }
    )
    @GetMapping("/is-username-available/{username}")
    public ResponseEntity<Boolean> isUsernameAvailable(
            @Parameter(description = "Юзернейм, который мы хотим проверить на занятость")
            @PathVariable String username) {
        boolean isExists = userService.checkUsernameExists(username);
        return ResponseEntity.ok(!isExists);
    }

    @Operation(
            summary = "Проверяем не занял ли переданный mail",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Запрос всегда возвращает 200 код, только если сервер не поломался",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "boolean",
                                            description = "true - почта доступна для регистрации, false - уже занята"
                                    )
                            )
                    )
            }
    )
    @GetMapping("/is-mail-available/{mail}")
    public ResponseEntity<Boolean> isMailAvailable(
            @Parameter(description = "Передаём почту, которую хотим проверить на доступность.")
            @PathVariable String mail) {
        boolean isExists = userService.checkMailExists(mail);
        return ResponseEntity.ok(!isExists);
    }
}
