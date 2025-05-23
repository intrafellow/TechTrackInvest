package vsu.tp5_3.techTrackInvest.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vsu.tp5_3.techTrackInvest.entities.enums.Stage;

@Entity
@Table(name = "startup")
@Getter
@Setter
@NoArgsConstructor
public class Startup {
    @Id
    @Column(name = "startup_resource_id")
    private String id;

    @Column(name = "sale_price", nullable = false)
    private int salePrice;

    @Column(name = "last_month_revenue", nullable = false)
    private int lastMonthRevenue;

    @Column(name = "expenses", nullable = false)
    private int expenses;

    @Column(name = "team", nullable = false)
    private int team;

    @Column(name = "budget", nullable = false)
    private int budget;

    @Column(name = "progress", nullable = false)
    private int progress;

    @Column(name = "reputation", nullable = false)
    private int reputation;

    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Enumerated(EnumType.STRING)
    @Column(name = "stage")
    private Stage stage;

}
