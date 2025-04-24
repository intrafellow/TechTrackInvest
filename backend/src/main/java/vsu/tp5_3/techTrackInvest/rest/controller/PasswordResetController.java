package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vsu.tp5_3.techTrackInvest.service.implementations.PasswordResetServiceImpl;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class PasswordResetController {
    private final PasswordResetServiceImpl passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        passwordResetService.sendPasswordResetToken(email);
        return ResponseEntity.ok("Password reset token sent to email");
    }
    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(
            @RequestParam String email,
            @RequestParam String token) {

        boolean isValid = passwordResetService.validateToken(email, token);

        if (isValid) {
            return ResponseEntity.ok("Token is valid");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam String email,
            @RequestParam String token,
            @RequestParam String newPassword) {

        if (!passwordResetService.validateToken(email, token)) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }

        // Здесь должна быть логика обновления пароля пользователя
        // userService.updatePassword(email, newPassword);

        // Удаляем использованный токен
        //passwordResetService.deleteToken(email);

        return ResponseEntity.ok("Password has been reset successfully");
    }
}
