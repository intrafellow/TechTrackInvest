package vsu.tp5_3.techTrackInvest.rest.controller;

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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/month")
public class MonthController {
    private final MonthService monthService;
    @GetMapping()
    public ResponseEntity<?> getStep() {
        /** По юзеру получаем текущий месяц*/
        return ResponseEntity.ok("jr");
    }
    @PostMapping("/end")
    public ResponseEntity<MonthEndDto> endStep() {
        return monthService.endMonth()
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ошибка завершения хода"
                ));
    }
}
