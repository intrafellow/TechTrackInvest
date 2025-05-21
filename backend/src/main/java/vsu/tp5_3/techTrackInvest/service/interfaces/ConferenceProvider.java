package vsu.tp5_3.techTrackInvest.service.interfaces;

import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;

import java.util.List;

public interface ConferenceProvider {
    public List<CurrentDisplayedConference> getRandomConferences(List<String> nicheId, int countPerNiche);
}
