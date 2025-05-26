package vsu.tp5_3.techTrackInvest.repositories.mongo;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import vsu.tp5_3.techTrackInvest.entities.mongo.CrisisMongo;

import java.util.List;

public interface CrisisMongoRepository extends MongoRepository<CrisisMongo, String> {
    @Aggregation(pipeline = {
            "{ '$match': { '_id': { '$nin': ?0 } } }",
            "{ '$sample': { 'size': 1 } }"
    })
    CrisisMongo findRandomEntityExcludingIds(List<String> ids);
}
