package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.ConferenceReadDto;
import vsu.tp5_3.techTrackInvest.mock.mockEntities.MockConference;
@Component
@RequiredArgsConstructor
public class ConferenceReadMapper implements Mapper<MockConference, ConferenceReadDto> {
    @Override
    public ConferenceReadDto map(MockConference object) {
        return new ConferenceReadDto(
                object.getId(),
                object.getName(),
                object.getDescription(),
                object.getCategoryId()
        );
    }
}
