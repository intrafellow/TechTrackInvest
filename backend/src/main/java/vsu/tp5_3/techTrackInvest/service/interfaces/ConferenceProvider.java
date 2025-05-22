package vsu.tp5_3.techTrackInvest.service.interfaces;

import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;

import java.util.List;

public interface ConferenceProvider {
    List<CurrentDisplayedConference> getRandomConferences(List<String> nicheId, int countPerNiche, Session session);
}
