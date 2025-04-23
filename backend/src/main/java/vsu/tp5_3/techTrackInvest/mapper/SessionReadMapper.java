package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.SessionReadDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
@Component
@RequiredArgsConstructor
public class SessionReadMapper implements Mapper<Session, SessionReadDto>{
    @Override
    public SessionReadDto map(Session object) {
        return new SessionReadDto(
                object.getId(),
                object.getAppUser().getId(),
                object.getMonthCount(),
                object.getStepCount(),
                object.getStartDate(),
                object.getConferences(),
                object.getStartups()
        );
    }
}
