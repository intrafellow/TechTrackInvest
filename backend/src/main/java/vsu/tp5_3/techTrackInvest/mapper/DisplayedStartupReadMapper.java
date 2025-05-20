package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;

@Component
@RequiredArgsConstructor
public class DisplayedStartupReadMapper implements Mapper<CurrentDisplayedStartup, StartupReadDto> {
    @Override
    public StartupReadDto map(CurrentDisplayedStartup object) {
        return new StartupReadDto(
                object.getResourceId(),
                object.getNicheId(),
                object.getName(),
                object.getDescription());
    }
}
