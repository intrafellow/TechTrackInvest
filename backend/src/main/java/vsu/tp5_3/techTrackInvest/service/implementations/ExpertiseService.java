package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.ExpertiseReadDto;
import vsu.tp5_3.techTrackInvest.mapper.ExpertiseReadMapper;
import vsu.tp5_3.techTrackInvest.mock.mockRepository.MockStartupRepository;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExpertiseService {
    private final MockStartupRepository startupRepository;
    private final ExpertiseReadMapper expertiseReadMapper;
    public Optional<ExpertiseReadDto> getExpertise(String id) {
        return startupRepository.findById(id).map(expertiseReadMapper::map);
    }
}
