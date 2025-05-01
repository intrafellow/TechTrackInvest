package vsu.tp5_3.techTrackInvest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Value;

@Value
@Schema(description = "Показывает какой стартап и за сколько мы продали")
public class StartupSellDTO {
    String startupName;
    Integer sellPrice;
}
