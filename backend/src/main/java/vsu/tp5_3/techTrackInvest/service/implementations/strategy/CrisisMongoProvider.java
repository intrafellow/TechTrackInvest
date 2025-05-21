package vsu.tp5_3.techTrackInvest.service.implementations.strategy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.entities.mongo.CrisisMongo;
import vsu.tp5_3.techTrackInvest.repositories.mongo.CrisisMongoRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.CrisisProvider;

@Component
@RequiredArgsConstructor
public class CrisisMongoProvider implements CrisisProvider {
    public final CrisisMongoRepository crisisMongoRepository;
    @Override
    public CrisisMongo getRandomCrisis() {
        return crisisMongoRepository.findRandomEntity();
    }
}
