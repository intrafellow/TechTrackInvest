package vsu.tp5_3.techTrackInvest.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import vsu.tp5_3.techTrackInvest.dto.CrisisReadDto;
import vsu.tp5_3.techTrackInvest.service.interfaces.CrisisService;

@Tag(name = "Управление кризисами", description = "Предоставляем методы для их получения и выбора их решений")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/crisis")
public class CrisisController {
    private final CrisisService crisisService;

    @Operation(
            summary = "Получение случайного кризиса"
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
            summary = "Решение кризиса по выбранному сценарию",
            description = "Передаём id решения и обновляется статус игры"
    )
    @PostMapping("/solution")
    public ResponseEntity<?> solve(@Parameter(description = "id выбранного решения кризиса", example = "solution-1")
                                       @PathVariable String solutionId) {
        crisisService.solve(solutionId);
        return ResponseEntity.ok("");
    }
}
