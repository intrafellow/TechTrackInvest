package vsu.tp5_3.techTrackInvest.repositories.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import vsu.tp5_3.techTrackInvest.entities.mongo.Solution;

public interface SolutionMongoRepository extends MongoRepository<Solution, Long> {
}
