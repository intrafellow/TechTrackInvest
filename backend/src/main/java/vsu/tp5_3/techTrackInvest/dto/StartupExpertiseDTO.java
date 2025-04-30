package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;
import vsu.tp5_3.techTrackInvest.entities.enums.Stage;

@Value
public class StartupExpertiseDTO {
    String name;
    String description;
    Integer price;
    String uniqueProductOffer;
    Integer lastMonthRevenue;
    Integer expenses;
    Integer team;
    Integer budget;
    Integer product;
    Integer reputation;
    Integer level;
    Stage stage;
}
