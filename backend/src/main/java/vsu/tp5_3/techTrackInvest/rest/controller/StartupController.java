package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vsu.tp5_3.techTrackInvest.dto.StartupListDto;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.service.implementations.ExpertiseService;
import vsu.tp5_3.techTrackInvest.service.implementations.StartupService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/startups")
public class StartupController {
    private final StartupService startupService;
    private final ExpertiseService expertiseService;
    //метод для полного получения страницы стартапов
    @GetMapping
    public StartupListDto findAll() {
        return startupService.getAllAvailableStartups();
    }


    @GetMapping("/niche/{nicheId}")
    public ResponseEntity<List<StartupReadDto>> findAllDisplayedByNicheId(@PathVariable String nicheId) {
        return ResponseEntity.ok(startupService.getCurrentDisplayedStartupsInNiche(nicheId));
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
