package vsu.tp5_3.techTrackInvest.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import vsu.tp5_3.techTrackInvest.dto.AppErrorDto;
import vsu.tp5_3.techTrackInvest.dto.ConferenceReadDto;
import vsu.tp5_3.techTrackInvest.dto.MonthEndDto;
import vsu.tp5_3.techTrackInvest.service.interfaces.MonthService;

import java.util.Optional;

@Tag(name = "Управление ходами", description = "Переход на новый месяц игры, где обновляются " +
        "стартапы, конференции и кол-во доступных очков действий")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/month")
public class MonthController {
    private final MonthService monthService;
    /** Завершение хода, который месяц */

    @Operation(
            summary = "Переход на следующий месяц игры"
    )
    @GetMapping("/finish")
    public ResponseEntity<MonthEndDto> endMonth() {
        return ResponseEntity.ok(monthService.endMonth().get());
    }
}
