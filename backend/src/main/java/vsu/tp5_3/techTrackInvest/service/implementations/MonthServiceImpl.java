package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
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

import java.util.*;

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

    private final Integer DEFAULT_ACTION_POINTS_PER_STEP = 5;
    @Override
    @Transactional
    public Optional<MonthEndDto> endMonth() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));
        Session session = sessionRepository.findTopByAppUserOrderByStartDateDesc(user)
                .orElseThrow(() -> new EntityNotFoundException("Сессия не найдена"));

        Step currentStep = session.getSteps().getLast();


        boolean isGameOver = false;
        String gameResultMessage = null;
        Integer totalEarnings = null;

        if (currentStep.getCash() < 0) {
            isGameOver = true;
            gameResultMessage = "Игра окончена, у вас закончились деньги";
        } else if (currentStep.getReputation() < 0) {
            isGameOver = true;
            gameResultMessage = "Игра окончена, ваша репутация упала ниже нуля";
        } else if (currentStep.getExpertiseList().stream().anyMatch(e -> e.getValue() < 0)) {
            isGameOver = true;
            gameResultMessage = "Игра окончена, один из показателей вашей экспертности упал ниже нуля";
        }


        boolean isVictory = false;
        if (!isGameOver && session.getMonthCount() >= 6) {
            isVictory = true;
            totalEarnings = calculateTotalEarnings(session);
            gameResultMessage = String.format("Победа! Вы прошли 6 месяцев и ваша общая прибыль: %d", totalEarnings);
        }


        if (isGameOver || isVictory) {
            return Optional.of(new MonthEndDto(
                    session.getMonthCount(),
                    session.getStepCount(),
                    Collections.emptyList(),
                    Collections.emptyList(),
                    isGameOver,
                    isVictory,
                    gameResultMessage,
                    totalEarnings
            ));
        }

        Step newStep = new Step();
        newStep.setCash(currentStep.getCash());
        newStep.setReputation(currentStep.getReputation());
        newStep.setExpertiseList(new ArrayList<>(currentStep.getExpertiseList()));
        for (Expertise e : newStep.getExpertiseList()) {
            e.setStep(newStep);
        }
        newStep.setSequenceNumber(currentStep.getSequenceNumber() + 1);
        newStep.setSession(session);
        session.getSteps().add(newStep);

        session.setStepCount(DEFAULT_ACTION_POINTS_PER_STEP);

        session.getCurrentDisplayedConferences().clear();
        session.getCurrentDisplayedStartups().clear();

        List<CurrentDisplayedConference> newConferences = new ArrayList<>();
        for (String nicheId : List.of("niche-1", "niche-2", "niche-3", "niche-4")) {
            newConferences.addAll(conferenceService.getRandomConferencesByNiche(4, nicheId, session));
        }
        session.getCurrentDisplayedConferences().addAll(newConferences);

        for (String nicheId : List.of("niche-1", "niche-2", "niche-3", "niche-4")) {
            startupService.updateDisplayedStartups(4, nicheId);
        }

        session.setMonthCount(session.getMonthCount() + 1);
        session = sessionRepository.save(session);

        List<ConferenceReadDto> conferenceDtos = session.getCurrentDisplayedConferences().stream()
                .map(conferenceReadPostgresMapper::map)
                .toList();

        List<StartupReadDto> startupDtos = session.getCurrentDisplayedStartups().stream()
                .map(displayedStartupReadMapper::map)
                .toList();

        return Optional.of(new MonthEndDto(
                session.getMonthCount(),
                session.getStepCount(),
                conferenceDtos,
                startupDtos,
                false,
                false,
                null,
                null
        ));
    }

    private int calculateTotalEarnings(Session session) {

        //суммарная стоимость стартапов
        double totalStartupsCost = session.getStartups().stream().mapToDouble(Startup::getSalePrice).sum();

        //получаем сколько у игрока денег нужно скопировать как я понял, на всякий случай
        List<Step> steps = new ArrayList<>(session.getSteps());
        steps.sort(Comparator.comparing(Step::getSequenceNumber));
        int playerCash = steps.getLast().getCash();
        // Логика расчета общего заработка
        return (int) (totalStartupsCost + playerCash);
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
