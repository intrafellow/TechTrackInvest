package vsu.tp5_3.techTrackInvest.service.interfaces;

import vsu.tp5_3.techTrackInvest.dto.FinishDto;
import vsu.tp5_3.techTrackInvest.dto.SessionReadDto;

import java.util.Optional;

public interface SessionService {
    Optional<SessionReadDto> creteSession();
    Optional<FinishDto> finishSession();
}
