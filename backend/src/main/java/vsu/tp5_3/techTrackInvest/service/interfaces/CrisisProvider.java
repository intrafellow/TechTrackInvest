package vsu.tp5_3.techTrackInvest.service.interfaces;

import vsu.tp5_3.techTrackInvest.entities.mongo.CrisisMongo;

public interface CrisisProvider {
    public CrisisMongo getRandomCrisis();
}
