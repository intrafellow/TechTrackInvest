package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vsu.tp5_3.techTrackInvest.dto.AppErrorDto;
import vsu.tp5_3.techTrackInvest.dto.ExpertiseReadDto;
import vsu.tp5_3.techTrackInvest.dto.StartupListDto;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.service.implementations.ExpertiseService;
import vsu.tp5_3.techTrackInvest.service.implementations.StartupService;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/startups")
public class StartupController {
    private final StartupService startupService;
    private final ExpertiseService expertiseService;
    //будем возвращать
    @GetMapping
    public StartupListDto findAll() {
        return new StartupListDto(List.of(), List.of());
    }

    /** пусть сервер наверное сам решает какой стартап возвращать, т.е
     * проверяет куплен он или нет тут
     * */

    @GetMapping("/{id}")
    public StartupReadDto findById(@PathVariable("id") String id) {
        return startupService.findById();
    }

    @GetMapping("/{id}/expertise")
    public ResponseEntity<?> getExpertise(@PathVariable("id") String id) {
//        Optional<ExpertiseReadDto> expertiseReadDto = expertiseService.getExpertise(id);
//        if (!expertiseReadDto.isPresent()) {
//            return new ResponseEntity<>(new AppErrorDto(HttpStatus.NOT_FOUND.value(), "Startup not found"),
//                    HttpStatus.NOT_FOUND);
//        }
//        return ResponseEntity.ok(expertiseReadDto);
        return ResponseEntity.ok(null);
    }



}
