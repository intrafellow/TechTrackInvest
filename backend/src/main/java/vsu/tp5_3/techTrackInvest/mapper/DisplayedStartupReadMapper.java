package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;
import vsu.tp5_3.techTrackInvest.service.implementations.NicheService;

@Component
@RequiredArgsConstructor
public class DisplayedStartupReadMapper implements Mapper<CurrentDisplayedStartup, StartupReadDto> {
    private final NicheService nicheService;
    @Override
    public StartupReadDto map(CurrentDisplayedStartup object) {
        return new StartupReadDto(
                object.getResourceId(),
                nicheService.getNicheName(object.getNicheId()),
                object.getName(),
                object.getDescription());
    }
}
