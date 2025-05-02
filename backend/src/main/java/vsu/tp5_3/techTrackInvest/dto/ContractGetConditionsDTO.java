package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;

@Value
public class ContractGetConditionsDTO {
    String contractId;
    Integer minPrice;
    Integer maxPrice;
    Integer userOfferedPrice;
}
