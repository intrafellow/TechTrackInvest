package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import vsu.tp5_3.techTrackInvest.dto.CrisisReadDto;
import vsu.tp5_3.techTrackInvest.service.interfaces.CrisisService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/crisis")
public class CrisisController {
    private final CrisisService crisisService;
    @GetMapping()
    public ResponseEntity<CrisisReadDto> findById() {
        return crisisService.getCrisis()
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Кризис не найден"
                ));
    }
    @PostMapping("/solution")
    public ResponseEntity<?> solve(@PathVariable String solutionId) {
        crisisService.solve(solutionId);
        return ResponseEntity.ok("");
    }
}
