package vsu.tp5_3.techTrackInvest.entities.postgre;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "current_displayed_startup")
public class CurrentDisplayedStartup {
    //класс используем, чтобы хранить стартапы, которые показываем во время хода. То есть
    //основная информация для пользователя. Если нажмёт купить то достанем всё из монго и сохраним правильно
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String resourceId;
    private String name;
    private String description;
    private Integer price;
    private String nicheId;


    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

}
