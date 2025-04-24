package vsu.tp5_3.techTrackInvest.entities.postgre;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "passwordResetToken")
@Setter
@Getter
@NoArgsConstructor
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "email", nullable = false, length = 50, unique = true)
    private String email;
    @Column(name = "password",nullable = false, length = 255)
    private String token;
    @CreationTimestamp
    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;
}
