package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.SessionReadDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.entities.postgre.Step;

import java.util.Comparator;

@Component
@RequiredArgsConstructor
public class SessionReadMapper implements Mapper<Session, SessionReadDto>{
    //добавил маппинг остальных методов, чтобы мы отправляли на фрон абсолютно все что есть в сессии основного
    @Override
    public SessionReadDto map(Session object) {
        return new SessionReadDto(
                object.getId(),
                object.getAppUser().getId(),
                object.getMonthCount(),
                object.getStepCount(),
                object.getStartDate(),
                object.getSteps().stream().max(Comparator.comparing(Step::getSequenceNumber)).get().getCash(),
                object.getCurrentDisplayedConferences(),
                object.getCurrentDisplayedStartups(),
                object.getConferences(),
                object.getStartups()
        );
    }
}
