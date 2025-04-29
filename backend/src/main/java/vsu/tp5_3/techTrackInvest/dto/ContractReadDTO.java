package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;

@Value
public class ContractReadDTO {
    private String contractId;
    private Integer minPrice;
    private Integer maxPrice;
}
