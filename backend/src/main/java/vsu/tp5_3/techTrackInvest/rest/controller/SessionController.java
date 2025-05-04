package vsu.tp5_3.techTrackInvest.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import vsu.tp5_3.techTrackInvest.dto.SessionReadDto;
import vsu.tp5_3.techTrackInvest.service.interfaces.SessionService;
@Tag(name = "Управление игровой сессией", description = "Можем начать сессию и завершить её")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/session")
public class SessionController {
    private final SessionService sessionService;

    @Operation(
            summary = "Запускаем новую игровую сессию",
            description = "Возвращаем основные показатели, доступные к покупке стартапы и кол-во действий"
    )
    @GetMapping("/start")
    public ResponseEntity<SessionReadDto> createSession() {
//        sessionService.finishSession();
        return sessionService.creteSession()
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Невозможно создать сессию"
                ));
    }
    /** В дто завернуть какие-то данные по завершению сессии */
    @Operation(
            summary = "Завершаем игровую сессию"
    )
    @GetMapping("/finish")
    public ResponseEntity<?> finishSession() {
        return sessionService.finishSession()
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Невозможно удалить сессию"
                ));
    }
}
