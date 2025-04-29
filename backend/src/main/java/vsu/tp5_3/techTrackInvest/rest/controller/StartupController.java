package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vsu.tp5_3.techTrackInvest.dto.StartupExpertiseDTO;
import vsu.tp5_3.techTrackInvest.dto.StartupListDto;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.dto.StepActionDto;
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

    @GetMapping("/{resourceId}/expertise/{price}")
    public ResponseEntity<StepActionDto<StartupExpertiseDTO>> getExpertise(@PathVariable("resourceId") String resourceId,
                                                                          @PathVariable int price) {

        return ResponseEntity.ok(startupService.getExpertise(resourceId, price));
    }


}
