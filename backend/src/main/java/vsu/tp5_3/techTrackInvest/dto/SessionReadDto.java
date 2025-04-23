package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;
import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;
import vsu.tp5_3.techTrackInvest.entities.postgre.Conference;
import vsu.tp5_3.techTrackInvest.entities.postgre.Startup;

import java.sql.Timestamp;
import java.util.List;

@Value
public class SessionReadDto {
    Long id;
    Long appUserId;
    int monthCount;
    int stepCount;
    Timestamp startDate;
    List<Conference> conferences;
    List<Startup> startups;
}
