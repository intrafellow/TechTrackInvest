package vsu.tp5_3.techTrackInvest.repositories.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;

public interface StartupMongoRepository extends MongoRepository<StartupMongo, String> {
}
