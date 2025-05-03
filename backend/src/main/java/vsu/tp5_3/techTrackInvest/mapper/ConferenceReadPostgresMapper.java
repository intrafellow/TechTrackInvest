package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.ConferenceReadDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;

@Component
@RequiredArgsConstructor
public class ConferenceReadPostgresMapper implements Mapper<CurrentDisplayedConference, ConferenceReadDto> {

    @Override
    public ConferenceReadDto map(CurrentDisplayedConference object) {
        return new ConferenceReadDto(
                object.getId(),
                object.getResourceId(),
                object.getName(),
                object.getDescription(),
                object.getNicheName(),
                object.getEnrollPrice()
        );
    }
}
