package vsu.tp5_3.techTrackInvest.service.interfaces;

import vsu.tp5_3.techTrackInvest.dto.MonthEndDto;

import java.util.Optional;

public interface MonthService {
    Optional<MonthEndDto> endMonth();
}
