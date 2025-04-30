package vsu.tp5_3.techTrackInvest.repositories.mongo;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import vsu.tp5_3.techTrackInvest.entities.mongo.CrisisMongo;

public interface CrisisMongoRepository extends MongoRepository<CrisisMongo, String> {
    @Aggregation(pipeline = {
            "{ $sample: { size: 1 } }"
    })
    CrisisMongo findRandomEntity();
}
