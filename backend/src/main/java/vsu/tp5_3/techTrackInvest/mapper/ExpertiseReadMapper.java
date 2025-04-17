package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.ExpertiseReadDto;
import vsu.tp5_3.techTrackInvest.mock.mockEntities.MockStartup;
@Component
@RequiredArgsConstructor
public class ExpertiseReadMapper implements Mapper<MockStartup, ExpertiseReadDto> {
    @Override
    public ExpertiseReadDto map(MockStartup object) {
        return new ExpertiseReadDto(
                object.getId(),
                object.getCategoryId(),
                object.getName(),
                object.getDescription(),
                object.getPrice(),
                object.getReputation());
    }
}
