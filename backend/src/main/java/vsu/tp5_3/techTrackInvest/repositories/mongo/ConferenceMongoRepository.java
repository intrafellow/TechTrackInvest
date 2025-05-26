package vsu.tp5_3.techTrackInvest.repositories.mongo;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;

import java.util.List;

public interface ConferenceMongoRepository extends MongoRepository<ConferenceMongo, String> {
    @Aggregation(pipeline = {
            "{ '$match': { 'nicheId': ?0 } }",
            "{ '$sample': { 'size': ?1 } }"
    })
    List<ConferenceMongo> findRandomConferencesByNiche(String nicheId, int conferenceCount);

    @Aggregation(pipeline = {
            "{ '$match': { 'nicheId': ?0, '_id': { '$nin': ?1 } } }",
            "{ '$sample': { 'size': ?2 } }"
    })
    List<ConferenceMongo> findRandomConferencesByNicheAndExcludedIds(String nicheId, List<String> excludedIds, int count);
}
