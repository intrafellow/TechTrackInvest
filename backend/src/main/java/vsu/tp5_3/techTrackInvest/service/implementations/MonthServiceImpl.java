package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.configs.GameBalanceConfig;
import vsu.tp5_3.techTrackInvest.dto.*;
import vsu.tp5_3.techTrackInvest.entities.mongo.NicheMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.*;
import vsu.tp5_3.techTrackInvest.mapper.ConferenceReadPostgresMapper;
import vsu.tp5_3.techTrackInvest.mapper.DisplayedStartupReadMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.NicheMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.*;
import vsu.tp5_3.techTrackInvest.service.interfaces.MonthService;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;

import java.util.*;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MonthServiceImpl implements MonthService {
    private final StartupService startupService;
    private final SessionRepository sessionRepository;
    private final ConferenceReadPostgresMapper conferenceReadPostgresMapper;
    private final DisplayedStartupReadMapper displayedStartupReadMapper;
    private final UpdateStartupService updateStartupService;
    private final NicheMongoRepository nicheMongoRepository;
    private final GameBalanceConfig gameBalanceConfig;
    private final ConferenceService conferenceService;
    private final StepService stepService;
    private final UserService userService;
    @Override
    @Transactional
    public Optional<MonthEndDto> endMonth() {
        Session session = userService.getUserDBSession();

        Step currentStep = stepService.getCurrentStep(session);
        //сначала мы обновляем значения всех стартапов, после уже начинаем проверять закончилась ли игра
        //чтобы обновлённые данные предоставлялись.
        updateStartupService.updateStartupsSpecs();
        //Далее проверяем, нужно учесть мёртвые стартапы и количество денег у игрока
        //Есть проблема, если будем сначала проверять хватит ли денег игроку на стартап хоть один то будем учитывать
        //предыдущие. Хотя если сразу покажем что он проиграл, то он и не увидит, что там могли бы быть те, что подойдут
        //по стоимости
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
        if (!isGameOver && session.getMonthCount() >= 20) {
            isVictory = true;
            totalEarnings = calculateTotalEarnings(session);
            gameResultMessage = String.format("Победа! Вы прошли 10 месяцев и ваша общая прибыль: %d", totalEarnings);
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
        List<Expertise> newExpertises = new ArrayList<>();
        currentStep.getExpertiseList().forEach(oldExpertise -> {
            Expertise expertise = new Expertise();
            expertise.setValue(oldExpertise.getValue());
            expertise.setResourceId(oldExpertise.getResourceId());
            expertise.setStep(newStep);
            newExpertises.add(expertise);
        });
        newStep.setExpertiseList(newExpertises);
        newStep.setSequenceNumber(currentStep.getSequenceNumber() + 1);
        newStep.setSession(session);
        session.getSteps().add(newStep);
        session.setStepCount(gameBalanceConfig.getDEFAULT_ACTION_POINTS_PER_STEP());



        List<String> allNichesIds = nicheMongoRepository.findAll().stream().map(NicheMongo::getName).toList();

        var newRandomConferences = conferenceService.updateDisplayedConference(3,
                allNichesIds, session);
        List<CurrentDisplayedConference> newConferences = new ArrayList<>(newRandomConferences);


        var newRandomStartups = startupService.updateDisplayedStartups(4, allNichesIds);
        List<CurrentDisplayedStartup> newStartups = new ArrayList<>(newRandomStartups);
        session.getCurrentDisplayedConferences().clear();
        session.getCurrentDisplayedStartups().clear();

        session.getCurrentDisplayedStartups().addAll(newStartups);
        session.getCurrentDisplayedConferences().addAll(newConferences);

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
        Session session = userService.getUserDBSession();
        return new StepCountDto(session.getStepCount());
    }

    @Override
    public MonthCountDto getMonthCount() {
        Session session = userService.getUserDBSession();
        return new MonthCountDto(session.getMonthCount());
    }
}
