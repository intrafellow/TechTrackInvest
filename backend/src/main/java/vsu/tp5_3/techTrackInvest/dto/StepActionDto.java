package vsu.tp5_3.techTrackInvest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Value;

@Value
@Schema(description = "Возвращается каждый раз, когда игрок совершает действие " +
        "отнимающее очки действия. Указывает было ли оно успешно совершено")
public class StepActionDto<T> {
    @Schema(description = "Показывает успешно ли совершили действие")
    boolean success;
    @Schema(description = "Возвращает специфичные данные для каждого действия")
    T content;
    @Schema(description = "Если успешно выполнили, то пуская строка. Если нет сообщение об ошибке",
            example = "У вас закончились ходы")
    String errorMessage;

    Integer stepsLeft;
}
