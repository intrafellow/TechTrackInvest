package vsu.tp5_3.techTrackInvest.service.interfaces;

import vsu.tp5_3.techTrackInvest.dto.CrisisReadDto;
import vsu.tp5_3.techTrackInvest.dto.StepActionDto;

import java.util.Optional;

public interface CrisisService {
    Optional<CrisisReadDto> getCrisis();

    StepActionDto<CrisisReadDto> solve(String solutionId);
}
