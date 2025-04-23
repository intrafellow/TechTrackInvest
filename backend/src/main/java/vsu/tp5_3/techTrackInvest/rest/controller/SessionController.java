package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import vsu.tp5_3.techTrackInvest.dto.SessionReadDto;
import vsu.tp5_3.techTrackInvest.service.interfaces.SessionService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/session")
public class SessionController {
    private final SessionService sessionService;
    @GetMapping("/start")
    public ResponseEntity<SessionReadDto> createSession() {
        return sessionService.creteSession()
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Невозможно создать сессию"
                ));
    }
    /** В дто завернуть какие-то данные по завершению сессии */
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
