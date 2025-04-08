package vsu.tp5_3.techTrackInvest.repository.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "session")
@Getter
@Setter
@NoArgsConstructor
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @Column(name = "month_count", nullable = false)
    private int monthCount;

    @Column(name = "step_count", nullable = false)
    private int stepCount;

    @Column(name = "start_date", nullable = false)
    private Timestamp startDate;

    @Column
    @OneToMany(mappedBy = "session", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Step> steps;

    @Column
    @OneToMany(mappedBy = "session", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CrisisHistory> crisisHistory;

    @Column
    @OneToMany(mappedBy = "session", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CurrentCrisis> currentCrisis;

    @Column
    @OneToMany(mappedBy = "session", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Conference> conferences;

    @Column
    @OneToMany(mappedBy = "session", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Startup> startups;


}
