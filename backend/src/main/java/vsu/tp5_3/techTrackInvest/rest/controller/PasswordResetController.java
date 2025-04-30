package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vsu.tp5_3.techTrackInvest.dto.PasswordResetDto;
import vsu.tp5_3.techTrackInvest.service.implementations.PasswordResetServiceImpl;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class PasswordResetController {
    private final PasswordResetServiceImpl passwordResetService;
    private final UserService userService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        passwordResetService.sendPasswordResetToken(email);
        return ResponseEntity.ok("Токен отправлен на электронную почту");
    }
    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(
            @RequestParam String email,
            @RequestParam String token) {

        boolean isValid = passwordResetService.validateToken(email, token);

        if (isValid) {
            return ResponseEntity.ok("Токен валиден");
        } else {
            return ResponseEntity.badRequest().body("Токен не валиден");
        }
    }

    // улучшить ситуация
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetDto passwordResetDto) {
        if (!userService.updatePassword(passwordResetDto.getEmail(), passwordResetDto.getNewPassword())) {
            return ResponseEntity.badRequest().body("Пользователь не найден");
        }

        passwordResetService.deleteToken(passwordResetDto.getEmail());

        return ResponseEntity.ok("Пароль успешно изменен");
    }
}
