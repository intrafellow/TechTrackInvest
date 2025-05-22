package vsu.tp5_3.techTrackInvest.service.implementations.strategy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.mapper.ConferenceMongoToDisplayedConferenceMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ConferenceMongoRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.ConferenceProvider;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ConferenceMongoProvider implements ConferenceProvider {
    private final ConferenceMongoRepository conferenceMongoRepository;
    private final ConferenceMongoToDisplayedConferenceMapper conferenceMongoToDisplayedConferenceMapper;

    @Override
    public List<CurrentDisplayedConference> getRandomConferences(List<String> nicheIds, int countPerNiche, Session session) {
        List<CurrentDisplayedConference> conferences = new ArrayList<>();

        for (String nicheId : nicheIds) {
            var conferencesInNiche = getRandomConferencesByNiche(countPerNiche, nicheId, session);
            conferences.addAll(conferencesInNiche);
        }
        return conferences;
    }

    private List<CurrentDisplayedConference> getRandomConferencesByNiche(int count, String nicheId, Session session) {
        List<ConferenceMongo> conferenceMongo = conferenceMongoRepository.findRandomConferencesByNiche(nicheId, count);
        return conferenceMongo.stream().map(conference -> {
            var postgresConference = conferenceMongoToDisplayedConferenceMapper.map(conference);
            postgresConference.setSession(session);
            return postgresConference;
        }).toList();
    }
}
