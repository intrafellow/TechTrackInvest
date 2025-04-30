package vsu.tp5_3.techTrackInvest.repositories.mongo;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;

import java.util.List;

public interface ConferenceMongoRepository extends MongoRepository<ConferenceMongo, String> {
    List<ConferenceMongo> findByNicheId(String nicheId, Pageable pageable);
}
