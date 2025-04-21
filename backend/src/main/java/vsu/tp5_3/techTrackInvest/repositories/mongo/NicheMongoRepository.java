package vsu.tp5_3.techTrackInvest.repositories.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import vsu.tp5_3.techTrackInvest.entities.mongo.NicheMongo;

public interface NicheMongoRepository extends MongoRepository<NicheMongo, String> {
}
