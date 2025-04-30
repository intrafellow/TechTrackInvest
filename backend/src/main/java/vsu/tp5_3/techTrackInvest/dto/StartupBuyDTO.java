package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;

@Value
public class StartupBuyDTO {
    String resourceId;
    Integer finalPrice;
    Integer teamEffect;
    Integer reputationEffect;
}
