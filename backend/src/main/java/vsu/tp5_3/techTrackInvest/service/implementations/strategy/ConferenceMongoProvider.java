package vsu.tp5_3.techTrackInvest.service.implementations.strategy;

import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;
import vsu.tp5_3.techTrackInvest.service.interfaces.ConferenceProvider;

import java.util.List;

public class ConferenceMongoProvider implements ConferenceProvider {
    @Override
    public List<CurrentDisplayedConference> getRandomConferences(List<String> nicheId, int countPerNiche) {
        return List.of();
    }
}
