package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;
import vsu.tp5_3.techTrackInvest.entities.enums.Stage;

@Value
public class StartupStatisticsDTO {
    String name;
    String description;
    Integer salePrice;
    Integer expenses;
    Integer lastMonthRevenue;
    Integer team;
    Integer budget;
    Integer progress;
    Integer reputation;
    Stage stage;
}
