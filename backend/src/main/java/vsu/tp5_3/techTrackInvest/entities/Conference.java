package vsu.tp5_3.techTrackInvest.entities;

import jakarta.persistence.*;
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
    @Column(name = "resource_conference_id")
    private String id;

    @Column(name = "conference_time")
    private int timestamp;

    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;
}


