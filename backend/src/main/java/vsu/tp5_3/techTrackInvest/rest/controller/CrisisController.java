package vsu.tp5_3.techTrackInvest.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import vsu.tp5_3.techTrackInvest.dto.CrisisReadDto;
import vsu.tp5_3.techTrackInvest.dto.StepActionDto;
import vsu.tp5_3.techTrackInvest.service.interfaces.CrisisService;

@Tag(name = "Управление кризисами", description = "Основные методы получения и решение кризисов")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/crisis")
public class CrisisController {
    private final CrisisService crisisService;

    @Operation(
            summary = "Получение случайного нового кризиса",
            description = "В случайный момент времени клиент запрашивает кризис, чтобы предоставить игроку решение"
    )
    @GetMapping()
    public ResponseEntity<CrisisReadDto> findById() {
        return crisisService.getCrisis()
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Кризис не найден"
                ));
    }

    @Operation(
            summary = "Выбираем решение кризиса",
            description = "Передаем id варианта решения кризиса, которое мы выбрали, чтобы применить эффекты"
    )
    @PostMapping("/solution/{solutionId}")
    public ResponseEntity<StepActionDto<CrisisReadDto>> solve(@PathVariable String solutionId) {
        return ResponseEntity.ok(crisisService.solve(solutionId));
    }
}
