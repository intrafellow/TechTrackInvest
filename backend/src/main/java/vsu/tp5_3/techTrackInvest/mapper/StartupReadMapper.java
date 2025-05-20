package vsu.tp5_3.techTrackInvest.mapper;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.Startup;

@Component
@AllArgsConstructor
public class StartupReadMapper implements Mapper<Startup, StartupReadDto> {
    @Override
    public StartupReadDto map(Startup object) {
        return new StartupReadDto(
                object.getResId(),
                object.getNicheId(),
                object.getName(),
                object.getDescription()
        );
    }
}
