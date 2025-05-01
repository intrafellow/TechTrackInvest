package vsu.tp5_3.techTrackInvest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Данные для входа пользователя")
public class LoginDto {
    @Schema(description = "почта пользователя", example = "leo.chep@mail.ru")
    private String email;
    @Schema(description = "пароль", example = "mama123f")
    private String password;
}
