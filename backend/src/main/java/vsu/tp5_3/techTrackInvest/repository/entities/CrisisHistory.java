package vsu.tp5_3.techTrackInvest.repository.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "crisisHistory")
@Setter
@Getter
@NoArgsConstructor
public class CrisisHistory {
    @Id
    @Column(name = "crysis_resource_id")
    private String crisisHistoryId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;
}
