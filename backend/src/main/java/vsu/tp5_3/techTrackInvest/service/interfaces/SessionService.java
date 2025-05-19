package vsu.tp5_3.techTrackInvest.service.interfaces;

import vsu.tp5_3.techTrackInvest.dto.FinishDto;
import vsu.tp5_3.techTrackInvest.dto.SessionReadDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.mapper.ConferenceMongoToDisplayedMapper;

import java.util.List;
import java.util.Optional;

public interface SessionService {
    Optional<SessionReadDto> creteSession();
    Optional<FinishDto> finishSession();
    List<StartupMongo> getRandomStartupsIntoNiche(int count, String nicheId);
    CurrentDisplayedConference convertToDisplayedConference(ConferenceMongo mongoConf, Session session);
    CurrentDisplayedStartup convertToDisplayedStartup(StartupMongo mongoStartup, Session session);
    Session getCurrentSession();

    Optional<SessionReadDto> loadSession();
}
