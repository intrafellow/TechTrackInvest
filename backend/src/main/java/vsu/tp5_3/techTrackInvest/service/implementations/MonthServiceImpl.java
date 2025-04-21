package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.MonthEndDto;
import vsu.tp5_3.techTrackInvest.service.interfaces.MonthService;

import java.util.Optional;
@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MonthServiceImpl implements MonthService {
    @Override
    public Optional<MonthEndDto> endMonth() {
        MonthEndDto monthEndDto = new MonthEndDto(5, "January");
        return Optional.of(monthEndDto);
    }
}
