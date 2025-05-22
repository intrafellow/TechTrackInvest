package vsu.tp5_3.techTrackInvest.service.interfaces;

import vsu.tp5_3.techTrackInvest.entities.mongo.Contract;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;

public interface ContractGenerator {
    Contract generateContract(StartupMongo startupMongo);
}
