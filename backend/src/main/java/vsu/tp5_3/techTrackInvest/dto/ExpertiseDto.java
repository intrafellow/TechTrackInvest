package vsu.tp5_3.techTrackInvest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Value;

import java.util.Map;

@Value
public class ExpertiseDto {
    @Schema(description = "Ключи - это названия ниш, значения соответственно показатель экспертизы в ней",
    example = "IT: 5, MedTech:10")
    Map<String, Integer> map;
}
