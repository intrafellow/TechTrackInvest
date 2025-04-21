package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;

import java.math.BigDecimal;

@Value
public class MoneyDto {
    Double cash;
    Double investment;
    Double total;
}
