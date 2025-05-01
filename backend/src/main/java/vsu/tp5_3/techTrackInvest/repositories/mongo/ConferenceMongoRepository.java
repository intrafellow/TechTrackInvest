package vsu.tp5_3.techTrackInvest.repositories.mongo;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;

import java.util.List;

public interface ConferenceMongoRepository extends MongoRepository<ConferenceMongo, String> {
    @Aggregation(pipeline = {
            "{ '$match': { 'nicheId': ?0 } }",
            "{ '$sample': { 'size': ?1 } }"
    })
    List<ConferenceMongo> findRandomConferencesByNiche(String nicheId, int conferenceCount);
}
