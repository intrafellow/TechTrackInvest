package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;
import vsu.tp5_3.techTrackInvest.entities.postgre.Conference;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;

import java.util.List;

@Value
public class MonthEndDto {
    Integer monthCount;
    Integer stepCount;
    List<ConferenceReadDto> currentDisplayedConferences;
    List<StartupReadDto> currentDisplayedStartups;
    Boolean isGameOver;
    Boolean isVictory;
    String gameResultMessage;
    Integer totalEarnings;
}
