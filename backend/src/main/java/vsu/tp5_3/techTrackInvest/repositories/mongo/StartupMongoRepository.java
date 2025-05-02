package vsu.tp5_3.techTrackInvest.repositories.mongo;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;

import java.util.List;

public interface StartupMongoRepository extends MongoRepository<StartupMongo, String> {
    List<StartupMongo> findAllByNicheAndIdNotIn(String nicheId, List<String> excludedIds, Pageable pageable);
    @Aggregation(pipeline = {
            "{ '$match': { 'niche': ?0 } }",
            "{ '$sample': { 'size': ?1 } }"
    })
    List<StartupMongo> findRandomStartupsByNiche(String nicheId, int startupsCount);


    @Aggregation(pipeline = {
            "{ '$match': { 'niche': ?0, '_id': { '$nin': ?1 } } }",
            "{ '$sample': { 'size': ?2 } }"
    })
    List<StartupMongo> findRandomStartupsByNicheAndExcludedIds(String nicheId, List<String> excludedIds, int count);
}
