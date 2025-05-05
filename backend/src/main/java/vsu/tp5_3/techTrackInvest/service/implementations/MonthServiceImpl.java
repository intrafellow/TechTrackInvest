package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.*;
import vsu.tp5_3.techTrackInvest.entities.postgre.*;
import vsu.tp5_3.techTrackInvest.mapper.ConferenceReadPostgresMapper;
import vsu.tp5_3.techTrackInvest.mapper.DisplayedStartupReadMapper;
import vsu.tp5_3.techTrackInvest.mapper.StartupReadMapper;
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
    private final StartupService startupService;
    private final StepRepository stepRepository;
    private final SessionRepository sessionRepository;
    private final SessionService sessionService;
    private final ConferenceService conferenceService;
    private final CurrentDisplayedStartupRepository startupRepository;
    private final CurrentDisplayedConferenceRepository conferenceRepository;
    private final EntityManager entityManager;
    private final ConferenceReadPostgresMapper conferenceReadPostgresMapper;
    private final DisplayedStartupReadMapper displayedStartupReadMapper;
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
        for (Expertise e : newStep.getExpertiseList()) {
            e.setStep(newStep);
        }
        newStep.setSequenceNumber(step.getSequenceNumber() + 1);
        newStep.setSession(session);
        session.getSteps().add(newStep);

        session.getCurrentDisplayedConferences().clear();
        session.getCurrentDisplayedStartups().clear();
        entityManager.flush();

        //List<CurrentDisplayedConference> newCurrentDisplayedConferences = conferenceService.getRandomConferencesByNiche(5, "niche-1", session);
        List<CurrentDisplayedConference> newCurrentDisplayedConferences = new ArrayList<>();
        List<CurrentDisplayedConference> niche1C = conferenceService.getRandomConferencesByNiche(4, "niche-1", session);
        List<CurrentDisplayedConference> niche2C = conferenceService.getRandomConferencesByNiche(4, "niche-2", session);
        List<CurrentDisplayedConference> niche3C = conferenceService.getRandomConferencesByNiche(4, "niche-3", session);
        List<CurrentDisplayedConference> niche4C = conferenceService.getRandomConferencesByNiche(4, "niche-4", session);
        newCurrentDisplayedConferences.addAll(niche1C);
        newCurrentDisplayedConferences.addAll(niche2C);
        newCurrentDisplayedConferences.addAll(niche3C);
        newCurrentDisplayedConferences.addAll(niche4C);
        session.getCurrentDisplayedConferences().addAll(newCurrentDisplayedConferences);
        session.setMonthCount(session.getMonthCount() + 1);
        entityManager.flush();
        List<ConferenceReadDto> conferenceReadDtos = session.getCurrentDisplayedConferences().stream().map(conferenceReadPostgresMapper::map).toList();



        /*List<CurrentDisplayedStartup> startups = sessionService.getRandomStartupsIntoNiche(1, "niche-1")
                .stream().map(startupMongo -> sessionService.convertToDisplayedStartup(startupMongo, session)).toList();*/
        //session.getCurrentDisplayedStartups().addAll(startups);
        startupService.updateDisplayedStartups(4, "niche-1");
        startupService.updateDisplayedStartups(4, "niche-2");
        startupService.updateDisplayedStartups(4, "niche-3");
        startupService.updateDisplayedStartups(4, "niche-4");
        List<CurrentDisplayedStartup> startups = session.getCurrentDisplayedStartups();
        List<StartupReadDto> startupReadDtos = startups.stream().map(displayedStartupReadMapper::map).toList();

        return Optional.of(new MonthEndDto(session.getMonthCount() + 1, session.getStepCount(), conferenceReadDtos, startupReadDtos));
    }

    @Override
    public StepCountDto getStepCount() {
        return new StepCountDto(userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .get().getSessions().getLast().getStepCount());
    }

    @Override
    public MonthCountDto getMonthCount() {
        return new MonthCountDto(userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .get().getSessions().getLast().getMonthCount());
    }
}
