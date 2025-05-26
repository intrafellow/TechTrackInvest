package vsu.tp5_3.techTrackInvest.service.implementations.strategy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.entities.mongo.CrisisMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.CrisisHistory;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.repositories.mongo.CrisisMongoRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.CrisisProvider;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CrisisMongoProvider implements CrisisProvider {
    public final CrisisMongoRepository crisisMongoRepository;
    public final UserService userService;
    @Override
    public CrisisMongo getRandomCrisis() {
        Session session = userService.getUserDBSession();
        List<String> usedCrisisId = session.getCrisisHistory().stream().map(CrisisHistory::getCrisisHistoryId).toList();
        return crisisMongoRepository.findRandomEntityExcludingIds(usedCrisisId);
    }
}
