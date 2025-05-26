package vsu.tp5_3.techTrackInvest.service.interfaces;

import vsu.tp5_3.techTrackInvest.dto.MonthCountDto;
import vsu.tp5_3.techTrackInvest.dto.MonthEndDto;
import vsu.tp5_3.techTrackInvest.dto.StepCountDto;

import java.util.Optional;

public interface MonthService {
    Optional<MonthEndDto> endMonth();

    StepCountDto getStepCount();

    MonthCountDto getMonthCount();

}
