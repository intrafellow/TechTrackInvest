package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.ConferenceReadDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.mock.mockEntities.MockConference;
@Component
@RequiredArgsConstructor
public class ConferenceReadMapper implements Mapper<ConferenceMongo, ConferenceReadDto> {
    @Override
    public ConferenceReadDto map(ConferenceMongo object) {
        return new ConferenceReadDto(
                object.getId(),
                object.getName(),
                object.getDescription(),
                object.getNicheId()
        );
    }
}
