package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.CrisisReadDto;
import vsu.tp5_3.techTrackInvest.mapper.CrisisReadMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.CrisisMongoRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.CrisisService;

import java.util.Optional;
@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrisisServiceImpl implements CrisisService {
    private final CrisisMongoRepository crisisMongoRepository;
    private final CrisisReadMapper crisisReadMapper;
    @Override
    public Optional<CrisisReadDto> getCrisis() {
        return Optional.ofNullable(crisisReadMapper.map(crisisMongoRepository.findRandomEntity()));
    }

    @Override
    public void solve(String solutionId) {

    }
}
