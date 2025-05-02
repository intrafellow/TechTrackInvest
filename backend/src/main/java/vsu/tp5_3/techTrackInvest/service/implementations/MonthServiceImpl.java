package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.MonthEndDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.entities.postgre.Step;
import vsu.tp5_3.techTrackInvest.repositories.postgre.*;
import vsu.tp5_3.techTrackInvest.service.interfaces.MonthService;
import vsu.tp5_3.techTrackInvest.service.interfaces.SessionService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MonthServiceImpl implements MonthService {
    private final UserRepository userRepository;
    private final StepRepository stepRepository;
    private final SessionRepository sessionRepository;
    private final SessionService sessionService;
    private final ConferenceService conferenceService;
    private final CurrentDisplayedStartupRepository startupRepository;
    private final CurrentDisplayedConferenceRepository conferenceRepository;
    private final EntityManager entityManager;
    @Override
    @Transactional
    public Optional<MonthEndDto> endMonth() {
        Session session = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .get().getSessions().getLast();
        Step step = session.getSteps().getLast();
        // Метод обработки обновления стартапов
        session.setStepCount(5);
        Step newStep = new Step();
        newStep.setCash(step.getCash());
        newStep.setReputation(step.getReputation());
        newStep.setExpertiseList(new ArrayList<>(step.getExpertiseList()));
        newStep.setSequenceNumber(step.getSequenceNumber() + 1);
        newStep.setSession(session);
        session.getSteps().add(newStep);

        session.getCurrentDisplayedConferences().clear();
        session.getCurrentDisplayedStartups().clear();
        entityManager.flush();

        List<CurrentDisplayedConference> newCurrentDisplayedConferences = conferenceService.getRandomConferencesByNiche(5, session);
        session.getCurrentDisplayedConferences().addAll(newCurrentDisplayedConferences);

        List<CurrentDisplayedStartup> startups = sessionService.getRandomStartupsIntoNiche(1, "niche-1", session)
                .stream().map(startupMongo -> sessionService.convertToDisplayedStartup(startupMongo, session)).toList();
        //session.getCurrentDisplayedStartups().addAll(startups);


        return Optional.of(new MonthEndDto(session.getStepCount(), newCurrentDisplayedConferences, startups));
    }
}
