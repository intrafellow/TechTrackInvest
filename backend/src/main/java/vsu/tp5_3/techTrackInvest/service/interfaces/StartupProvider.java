package vsu.tp5_3.techTrackInvest.service.interfaces;

import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;

import java.util.List;

public interface StartupProvider {
    public List<CurrentDisplayedStartup> getRandomStartups(List<String> nicheIds, int countPerNiche);
}
