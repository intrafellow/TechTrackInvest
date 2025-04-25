package vsu.tp5_3.techTrackInvest.entities.postgre;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "current_displayed_conference")
public class CurrentDisplayedConference {
    //класс используем, чтобы хранить конференции, которые показываем на ходу. То есть
    //основная информация для пользователя. Если нажмёт купить то достанем всё из монго и сохраним правильно
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String resourceId;

    private String name;

    private String description;

    private String nicheName;

    private Integer enrollPrice;

    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;
}
