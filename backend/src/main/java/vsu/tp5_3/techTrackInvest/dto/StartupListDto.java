package vsu.tp5_3.techTrackInvest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Value;

import java.util.List;

@Value
public class StartupListDto {
    @Schema(description = "купленные стартапы")
    List<StartupReadDto> purchasedStartups;
    @Schema(description = "предлагаемые к покупке стартапы")
    List<StartupReadDto> availableStartups;
}
