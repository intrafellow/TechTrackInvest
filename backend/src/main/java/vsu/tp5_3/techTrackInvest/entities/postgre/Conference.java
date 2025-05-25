package vsu.tp5_3.techTrackInvest.entities.postgre;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "conference")
@Getter
@Setter
@NoArgsConstructor
public class Conference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resource_conference_id")
    private String resourceConferenceId;
    //на каком ходу мы сходили на конференцию
    @Column(name = "conference_time")
    private int timestamp;

    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;
}


