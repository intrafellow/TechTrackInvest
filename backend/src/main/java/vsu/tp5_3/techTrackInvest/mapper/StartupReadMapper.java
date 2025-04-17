package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.mock.mockEntities.MockStartup;
@Component
@RequiredArgsConstructor
public class StartupReadMapper implements Mapper<MockStartup, StartupReadDto> {
    @Override
    public StartupReadDto map(MockStartup object) {
        return new StartupReadDto(
                object.getId(),
                object.getCategoryId(),
                object.getName(),
                object.getDescription());
    }
}
