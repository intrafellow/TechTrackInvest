package vsu.tp5_3.techTrackInvest.repository.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column
    @OneToMany(mappedBy = "appUser", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Session> sessions;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "email", nullable = false, length = 50, unique = true)
    private String email;

    @Column(name = "password",nullable = false, length = 255)
    private String passwordHash;

    @CreationTimestamp
    @Column(name = "registration_date", nullable = false)
    private Timestamp registrationDate;

    @Column(nullable = false)
    private int level;

    @Column
    private BigInteger balance;

}
