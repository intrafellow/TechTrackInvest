package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;

@Value
public class ContractDealDTO {
    String contractId;
    String startupId;
    String startupName;
    String description;
    Integer finalPrice;
    Integer rollResult;
}
