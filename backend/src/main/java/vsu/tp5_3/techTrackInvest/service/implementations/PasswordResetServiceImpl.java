package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.entities.postgre.PasswordResetToken;
import vsu.tp5_3.techTrackInvest.repositories.postgre.PasswordResetTokenRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PasswordResetServiceImpl {
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JavaMailSender mailSender;

    private static final int TOKEN_LENGTH = 6;
    private static final int TOKEN_EXPIRY_HOURS = 1;

    @Transactional
    public void sendPasswordResetToken(String email) {
        passwordResetTokenRepository.deleteByEmail(email);
        passwordResetTokenRepository.flush();
        String token = generateToken();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(email);
        resetToken.setToken(token);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(TOKEN_EXPIRY_HOURS));
        passwordResetTokenRepository.save(resetToken);

        sendEmail(email, token);
    }

    @Transactional
    public boolean validateToken(String email, String token) {
        Optional<PasswordResetToken> resetToken = passwordResetTokenRepository.findByEmailAndToken(email, token);
        if (!resetToken.isPresent()) {
            return false;
        }

        PasswordResetToken tokenEntity = resetToken.get();
        if (tokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(tokenEntity);
            return false;
        }

        return true;
    }

    private String generateToken() {
        Random random = new Random();
        StringBuilder token = new StringBuilder();

        for (int i = 0; i < TOKEN_LENGTH; i++) {
            token.append(random.nextInt(10));
        }

        return token.toString();
    }

    private void sendEmail(String email, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("TechTrackInvest <techtrackinvest@gmail.com>");
            message.setTo(email);
            message.setSubject("Password Reset Request");
            message.setText("Ваш токен: " + token);

            mailSender.send(message);
            System.out.println("Email отправлен успешно на " + email);
        } catch (Exception e) {
            System.err.println("Ошибка при отправке email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void deleteToken(String email) {
        passwordResetTokenRepository.deleteByEmail(email);
    }
}
