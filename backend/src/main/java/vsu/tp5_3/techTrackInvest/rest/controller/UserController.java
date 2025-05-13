package vsu.tp5_3.techTrackInvest.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import vsu.tp5_3.techTrackInvest.dto.*;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;

import java.util.Optional;

@Tag(name = "Управление пользователем", description = "Предоставляем основные операции юзера. Получение денег, репутации...")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;

    @Operation(
            summary = "Получение текущего состояния игрока",
            description = "Получаем все его активы. Кол-во денег на руках и суммарную стоимость стартапов"
    )
    @GetMapping("/money")
    public ResponseEntity<MoneyDto> getMoney() {
        return userService.getMoney()
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Пользователь не найден"
                ));
    }

    @Operation(
            summary = "Получаем репутацию игрока"
    )
    @GetMapping("/reputation")
    public ResponseEntity<ReputationDto> getReputation() {
        return userService.getReputation()
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Пользователь не найден"
                ));
    }

    @Operation(
            summary = "Получаем его экспертизу во всех нишах"
    )
    @GetMapping("/expertise")
    public ResponseEntity<ExpertiseDto> getExpertise() {
        return userService.getExpertise()
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Пользователь не найден"
                ));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile() {
        return userService.getProfile()
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Пользователь не найден"
                ));
    }

    @PostMapping("/change-email")
    public ResponseEntity<UserProfileDto> changeEmail(@RequestParam String email) {
        return userService.changeEmail(email)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Пользователь не найден"
                ));
    }

    @PostMapping("/change-username")
    public ResponseEntity<UserProfileDto> changeUsername(@RequestParam String username) {
        return userService.changeUsername(username)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Пользователь не найден"
                ));
    }

    @PostMapping("/change-password")
    public ResponseEntity<UserProfileDto> changePassword(@RequestParam String password) {
        return userService.changePassword(password)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Пользователь не найден"
                ));
    }
}
