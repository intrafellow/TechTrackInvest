package vsu.tp5_3.techTrackInvest.mapper;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.Startup;
import vsu.tp5_3.techTrackInvest.service.implementations.NicheService;

@Component
@AllArgsConstructor
public class StartupReadMapper implements Mapper<Startup, StartupReadDto> {
    private final NicheService nicheService;
    @Override
    public StartupReadDto map(Startup object) {
        return new StartupReadDto(
                object.getResId(),
                nicheService.getNicheName(object.getNicheId()),
                object.getName(),
                object.getDescription()
        );
    }
}
