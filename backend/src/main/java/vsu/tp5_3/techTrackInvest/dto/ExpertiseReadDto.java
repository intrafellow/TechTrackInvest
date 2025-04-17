package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;

import java.math.BigDecimal;
@Value
public class ExpertiseReadDto {
    String id;
    Integer categoryId;
    String name;
    String description;
    BigDecimal price;
    Integer reputation;
}
