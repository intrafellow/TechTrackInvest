package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vsu.tp5_3.techTrackInvest.dto.*;
import vsu.tp5_3.techTrackInvest.service.implementations.StartupService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/startups")
public class StartupController {
    private final StartupService startupService;

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

    @PostMapping("/buy")
    public ResponseEntity<StepActionDto<StartupReadDto>> confirmContract(@RequestBody StartupBuyDTO startupBuyDTO) {
        var result = startupService.buyStartup(startupBuyDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/sell/{startupResourceId}")
    public ResponseEntity<StepActionDto<StartupSellDTO>> sellStartup(@PathVariable String startupResourceId) {
        var infoAboutSale = startupService.sellStartup(startupResourceId);
        return ResponseEntity.ok(infoAboutSale);
    }

}
