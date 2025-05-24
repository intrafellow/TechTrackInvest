package vsu.tp5_3.techTrackInvest.service.interfaces;

import reactor.core.publisher.Mono;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.mongo.CrisisMongo;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;

import java.util.List;

public interface AIService {
    Mono<CrisisMongo> requestCrisis();
    Mono<List<StartupMongo>> requestStartups(String nicheId, int quantity);
    Mono<List<ConferenceMongo>> requestConferences(String nicheId, int quantity);
}
