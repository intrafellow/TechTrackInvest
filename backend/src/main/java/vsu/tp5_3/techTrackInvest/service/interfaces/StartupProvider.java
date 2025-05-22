package vsu.tp5_3.techTrackInvest.service.interfaces;

import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;

import java.util.List;

public interface StartupProvider {
    List<CurrentDisplayedStartup> getRandomStartups(List<String> nicheIds, int countPerNiche, Session session);
}
