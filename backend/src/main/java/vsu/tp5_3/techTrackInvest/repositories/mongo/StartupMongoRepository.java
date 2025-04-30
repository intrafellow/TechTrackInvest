package vsu.tp5_3.techTrackInvest.repositories.mongo;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;

import java.util.List;

public interface StartupMongoRepository extends MongoRepository<StartupMongo, String> {
    List<StartupMongo> findByNiche(String nicheId, Pageable pageable);
    List<StartupMongo> findAllByNicheAndIdNotIn(String nicheId, List<String> excludedIds, Pageable pageable);
}
