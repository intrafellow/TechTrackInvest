package vsu.tp5_3.techTrackInvest.entities.postgre;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "current_сrisis")
@Getter
@Setter
@NoArgsConstructor
public class CurrentCrisis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "crisis_resource_id", nullable = false)
    private String crisisId;

    @OneToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private Session session;
}
