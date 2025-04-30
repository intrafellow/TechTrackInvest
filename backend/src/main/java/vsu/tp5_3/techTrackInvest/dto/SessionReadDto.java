package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;
import vsu.tp5_3.techTrackInvest.entities.postgre.Conference;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;
import vsu.tp5_3.techTrackInvest.entities.postgre.Startup;

import java.sql.Timestamp;
import java.util.List;

//теперь этот класс возвращает абсолютно все данные о сессии(стартапы, купленные и которые доступны для покупки
//конфереции так же и основные данные
// todo адище возвращается, надо поправить
@Value
public class SessionReadDto {
    Long id;
    Long appUserId;
    int monthCount;
    int stepCount;
    Timestamp startDate;
    int cash;
    List<CurrentDisplayedConference> conferencesToShow;
    List<CurrentDisplayedStartup> startupsToShow;
    List<Conference> pastConferences;
    List<Startup> boughtStartups;
}
