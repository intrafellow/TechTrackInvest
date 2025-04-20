package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/step")
public class StepController {
    @GetMapping()
    public ResponseEntity<?> getStep() {
        /** По юзеру получаем текущий ход - автоматом нужно знать юзер айди*/
        return ResponseEntity.ok("jr");
    }
}
