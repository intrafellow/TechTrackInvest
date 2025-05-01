package vsu.tp5_3.techTrackInvest.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import vsu.tp5_3.techTrackInvest.dto.AppErrorDto;
import vsu.tp5_3.techTrackInvest.dto.RegistrationDto;
import vsu.tp5_3.techTrackInvest.dto.UserReadDto;
import vsu.tp5_3.techTrackInvest.service.implementations.UserServiceImpl;

@Tag(name = "Регистрация", description = "регистрация нового пользователя с уникальной почтой и ником")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/registration")
public class RegistrationController {
    private final UserServiceImpl userService;

    @Operation(
            summary = "Регистрация",
            description = "Необходимо для начала игры"
    )
    @PostMapping
    public ResponseEntity<UserReadDto> createNewUser(@RequestBody RegistrationDto registrationDto) {
        userService.findByEmail(registrationDto.getEmail())
                .ifPresent(user -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Пользователь с таким email уже существует"
                    );
                });
        return ResponseEntity.ok(userService.create(registrationDto));
    }
}
