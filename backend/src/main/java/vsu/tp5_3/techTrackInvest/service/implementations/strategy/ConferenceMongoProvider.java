package vsu.tp5_3.techTrackInvest.service.implementations.strategy;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.mapper.ConferenceMongoToDisplayedMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ConferenceMongoRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.ConferenceProvider;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Setter
@Getter
public class ConferenceMongoProvider implements ConferenceProvider {
    private final UserService userService;
    private final ConferenceMongoRepository conferenceMongoRepository;
    private final ConferenceMongoToDisplayedMapper conferenceMongoToDisplayedMapper;

    @Override
    public List<CurrentDisplayedConference> getRandomConferences(List<String> nicheIds, int countPerNiche) {
        Session session = userService.getUserDBSession();
        List<CurrentDisplayedConference> conferences = new ArrayList<>();

        for (String nicheId : nicheIds) {
            var conferencesInNiche = getRandomConferencesByNiche(countPerNiche, nicheId, session);
            conferences.addAll(conferencesInNiche);
        }
        return conferences;
    }

    private List<CurrentDisplayedConference> getRandomConferencesByNiche(int count, String nicheId, Session session) {
        List<ConferenceMongo> conferenceMongos = conferenceMongoRepository.findRandomConferencesByNiche(nicheId, count);
        return conferenceMongos.stream().map(c -> conferenceMongoToDisplayedMapper.map(c, session)).toList();
    }
}
