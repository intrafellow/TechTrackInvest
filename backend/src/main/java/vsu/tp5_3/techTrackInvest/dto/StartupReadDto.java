package vsu.tp5_3.techTrackInvest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Value;

@Value
public class StartupReadDto {
    @Schema(name = "id стартапа, по которому его можно найти в монго и постгрес")
    String resourceId;
    @Schema(name = "Название ниши", example = "MedTech")
    String categoryName;
    String name;
    String description;
}
