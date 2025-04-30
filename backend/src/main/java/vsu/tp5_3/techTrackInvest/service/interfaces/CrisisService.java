package vsu.tp5_3.techTrackInvest.service.interfaces;

import vsu.tp5_3.techTrackInvest.dto.CrisisReadDto;

import java.util.Optional;

public interface CrisisService {
    Optional<CrisisReadDto> getCrisis();

    void solve(String solutionId);
}
