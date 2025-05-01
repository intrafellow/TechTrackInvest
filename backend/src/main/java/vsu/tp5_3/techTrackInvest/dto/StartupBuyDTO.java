package vsu.tp5_3.techTrackInvest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Value;
import org.springframework.stereotype.Component;

@Value
@Schema(title = "Объект для покупки стартапа")
public class StartupBuyDTO {
    @Schema(description = "id в виде строки(не числовое)", example = "startup-1")
    String resourceId;
    @Schema(description = "Цена, которую мы получили после броска кубика")
    Integer finalPrice;
    @Schema(description = "Влияние на команду стартапа. Зависит тоже от броска кубика", example = "-10")
    Integer teamEffect;
    @Schema(description = "Влияние сделки на репутацию игрока", example = "-10")
    Integer reputationEffect;
}
