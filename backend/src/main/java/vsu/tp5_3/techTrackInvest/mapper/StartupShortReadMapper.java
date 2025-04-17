package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.StartupShortReadDto;
import vsu.tp5_3.techTrackInvest.mock.mockEntities.MockStartup;
@Component
@RequiredArgsConstructor
public class StartupShortReadMapper implements Mapper<MockStartup, StartupShortReadDto> {
    @Override
    public StartupShortReadDto map(MockStartup object) {
        return new StartupShortReadDto(
                object.getId(),
                object.getCategoryId(),
                object.getName());
    }
}
