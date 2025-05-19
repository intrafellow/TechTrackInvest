package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;

@Component
@RequiredArgsConstructor
public class ConferenceMongoToDisplayedMapper {
    public CurrentDisplayedConference map(ConferenceMongo object, Session session) {
        CurrentDisplayedConference conference = new CurrentDisplayedConference();
        conference.setResourceId(object.getId());
        conference.setName(object.getName());
        conference.setDescription(object.getDescription());
        conference.setEnrollPrice(object.getEnrollPrice());
        conference.setNicheName(object.getNicheId());
        conference.setSession(session);
        return conference;
    }
}
