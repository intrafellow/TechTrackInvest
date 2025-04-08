package vsu.tp5_3.techTrackInvest.repository.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "expertise")
@Getter
@Setter
@NoArgsConstructor
public class Expertise {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(nullable = false)
    private int value;

    @Column(name = "expertise_resource_id", unique = true, nullable = false)
    private String resourceId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "step_id", nullable = false)
    private Step step;

}
