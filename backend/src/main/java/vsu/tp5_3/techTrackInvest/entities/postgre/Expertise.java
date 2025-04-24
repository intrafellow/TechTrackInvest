package vsu.tp5_3.techTrackInvest.entities.postgre;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "expertise_value")
    private int value;

    @Column(name = "expertise_resource_id", nullable = false)
    private String resourceId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "step_id", nullable = false)
    private Step step;

}
