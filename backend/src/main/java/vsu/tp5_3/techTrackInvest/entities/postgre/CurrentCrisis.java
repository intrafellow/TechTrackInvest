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
    @Column(name = "crisis_resource_id")
    private String crisisId;

    @OneToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;
}
