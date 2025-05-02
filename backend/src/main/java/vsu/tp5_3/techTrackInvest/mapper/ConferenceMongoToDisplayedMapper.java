package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.service.implementations.NicheService;

@Component
@RequiredArgsConstructor
public class ConferenceMongoToDisplayedMapper {
    private final NicheService nicheService;
    public CurrentDisplayedConference map(ConferenceMongo object, Session session) {
        CurrentDisplayedConference conference = new CurrentDisplayedConference();
        conference.setResourceId(object.getId());
        conference.setName(object.getName());
        conference.setDescription(object.getDescription());
        conference.setEnrollPrice(object.getEnrollPrice());
        conference.setNicheName(nicheService.getNicheName(object.getNicheId()));
        conference.setSession(session);
        return conference;
    }
}
