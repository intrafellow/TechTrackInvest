package vsu.tp5_3.techTrackInvest.repositories.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import vsu.tp5_3.techTrackInvest.entities.mongo.Contract;

import java.util.Optional;

public interface ContractMongoRepository extends MongoRepository<Contract, String> {
    Optional<Contract> findByStartupId(String id);
}
