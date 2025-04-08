package vsu.tp5_3.techTrackInvest.repository.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "currentCrisis")
@Getter
@Setter
@NoArgsConstructor
public class CurrentCrisis {

    @Id
    @Column(name = "crisis_resource_id")
    private String crisisId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;
}
