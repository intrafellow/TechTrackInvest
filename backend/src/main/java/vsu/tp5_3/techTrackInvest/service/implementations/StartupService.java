package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.annotation.NeedTest;
import vsu.tp5_3.techTrackInvest.annotation.Tested;
import vsu.tp5_3.techTrackInvest.dto.*;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.*;
import vsu.tp5_3.techTrackInvest.exceptions.LastStepNotFoundException;
import vsu.tp5_3.techTrackInvest.exceptions.UserNotFoundException;
import vsu.tp5_3.techTrackInvest.mapper.*;
import vsu.tp5_3.techTrackInvest.repositories.mongo.StartupMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.CurrentDisplayedStartupRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.SessionRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.StartupRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;
import vsu.tp5_3.techTrackInvest.service.StepValidationResult;
import vsu.tp5_3.techTrackInvest.service.interfaces.SessionService;

import java.util.*;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StartupService {
    private final StartupRepository startupRepository;
    private final StartupMongoRepository startupMongoRepository;
    private final CurrentDisplayedStartupRepository currentDisplayedStartupRepository;
    private final SessionRepository sessionRepository;
    private final DisplayedStartupReadMapper displayedStartupReadMapper;
    private final StartupReadMapper startupReadMapper;
    private final UserRepository userRepository;
    private final StepService stepService;
    private final StartupExpertiseMapper startupExpertiseMapper;
    private final StartupMongoToBoughtStartupMapper startupMongoToBoughtStartupMapper;
    private final SessionService sessionService;
    private final StartupStatisticsMapper startupStatisticsMapper;

    @Tested
    //нужен чтобы получать все доступные стартапы для покупки по определённой категории(в ui есть такой выбор)
    public List<StartupReadDto> getCurrentDisplayedStartupsInNiche(String nicheId) {
        return currentDisplayedStartupRepository.findAllByNicheId(nicheId).stream()
                .map(displayedStartupReadMapper::map).toList();
    }

    @Tested
    //нужен чтобы получать все стартапы, с которыми взаимодействует игрок(купленные и те, что может купить)
    public StartupListDto getAllAvailableStartups() {
        //получить все купленные стартапы
        //получить все, что может сейчас купить
        Session session = sessionService.getCurrentSession();
        List<Startup> allBoughtStartups = session.getStartups();
        List<CurrentDisplayedStartup> allReadyToBuyStartups = session.getCurrentDisplayedStartups();

        //маппим всё в startupReadDTO поскольку показываем по стандарту только эти данные

        List<StartupReadDto> readyToBuyStartups = allReadyToBuyStartups.stream()
                .map(displayedStartupReadMapper::map).toList();

        List<StartupReadDto> boughtStartups = allBoughtStartups.stream()
                .map(startupReadMapper::map).toList();

        return new StartupListDto(boughtStartups, readyToBuyStartups);

    }


    @Tested
    @Transactional
    //метод который отвечает за обновление n-го количества стартапов из какой-то ниши для покупки
        public void updateDisplayedStartups(int startupsCount, String nicheId) {
            //получаем сессию и купленные/предлагаемых стартапы именно из неё
            //Собираем все id купленных стартапов из определённой ниши
            //Собираем все id показываемых стартапов из определённой ниши
            //формируем set из этих значений
            //делаем запрос к монго, чтобы она нашла n-ое количество уникальных стартапов

            Set<String> usedStartupIds = new HashSet<>();

            Session session = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                    .get().getSessions().getLast();

            session.getCurrentDisplayedStartups().forEach(startup -> usedStartupIds.add(startup.getResourceId()));
            session.getStartups().forEach(startup -> usedStartupIds.add(startup.getResId()));

            List<CurrentDisplayedStartup> resultNewStartups = new ArrayList<>();
            List<StartupMongo> retrievedStartups = startupMongoRepository.findRandomStartupsByNicheAndExcludedIds(nicheId,
                    new ArrayList<>(usedStartupIds), startupsCount);
            if (retrievedStartups.isEmpty()) {
                throw new EntityNotFoundException("No startup found for id " + nicheId);
            }
            //заполнили новую сущность, привязали к сессии, добавили в список новых стартапов
            for (StartupMongo startup : retrievedStartups) {
                CurrentDisplayedStartup currentDisplayedStartup = new CurrentDisplayedStartup();
                currentDisplayedStartup.setNicheId(startup.getNiche());
                currentDisplayedStartup.setResourceId(startup.getId());
                currentDisplayedStartup.setName(startup.getName());
                currentDisplayedStartup.setDescription(startup.getDescription());
                currentDisplayedStartup.setPrice(startup.getPrice());
                currentDisplayedStartup.setSession(session);
                resultNewStartups.add(currentDisplayedStartup);
            }
            //нам нужно удалить все старые стартапы, которые раньше предлагались к покупке
            session.getCurrentDisplayedStartups().clear();
            //добавляем новых
            session.getCurrentDisplayedStartups().addAll(resultNewStartups);
            //нужно сохранить сессию
            sessionRepository.save(session);
        }

    //Метод, который отвечает за экспертизу
    @Transactional
    public StepActionDto<StartupExpertiseDTO> getExpertise(String resourceId, int expertisePrice) {
        StepValidationResult validationResult = stepService.validateStep();

        if (!validationResult.isValid()) {
            return new StepActionDto<>(false, null,
                    validationResult.getMessage(), 0);
        }

        StartupMongo originalStartup = startupMongoRepository.findById(resourceId).orElseThrow(
                () -> new EntityNotFoundException("No startup found in mongoDB for resourceId " + resourceId)
        );

        Session session = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .get().getSessions().getLast();
        Step currentStep = session.getSteps().stream().max(Comparator.comparing(Step::getSequenceNumber)).orElseThrow(
                () -> new EntityNotFoundException("No step found for session")
        );

        int currentPlayerCash = currentStep.getCash();

        // Если price == 0, просто возвращаем цену экспертизы, не тратим деньги и очки действий
        if (expertisePrice == 0) {
            StartupExpertiseDTO startupExpertiseDTO = startupExpertiseMapper.map(originalStartup);
            return new StepActionDto<>(true, startupExpertiseDTO, null, validationResult.getSteps());
        }

        if (currentPlayerCash < expertisePrice) return new StepActionDto<>(false, null,
                "Недостаточно средств для покупки экспертизы", validationResult.getSteps());

        currentPlayerCash -= expertisePrice;
        currentStep.setCash(currentPlayerCash);
        stepService.executeStep();
        StartupExpertiseDTO startupExpertiseDTO = startupExpertiseMapper.map(originalStartup);
        return new StepActionDto<>(true, startupExpertiseDTO, null,
                validationResult.getSteps() - 1);
    }

    @Transactional
    public StepActionDto<StartupReadDto> buyStartup(StartupBuyDTO startupBuyDTO) {
        Session session = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(UserNotFoundException::new).getSessions().getLast();
        Step currentStep = session.getSteps().stream().max(Comparator.comparing(Step::getSequenceNumber)).orElseThrow(
                () -> new LastStepNotFoundException("Не смогли получить последний ход игрока")
        );
        int playerCash = currentStep.getCash();

        if (playerCash < startupBuyDTO.getFinalPrice()) {
            return new StepActionDto<>(false, null, "У вас недостаточно денег для покупки",
                    session.getStepCount());
        }

        StartupMongo originalStartup = startupMongoRepository.findById(startupBuyDTO.getResourceId()).orElseThrow();
        Startup startup = startupMongoToBoughtStartupMapper.map(originalStartup);

        currentStep.setCash(currentStep.getCash() - startupBuyDTO.getFinalPrice());
        currentStep.setReputation(currentStep.getReputation() + startupBuyDTO.getReputationEffect());
        startup.setTeam(startup.getTeam() + startupBuyDTO.getTeamEffect());
        startup.setSession(session);
        startupRepository.save(startup);


        //TODO тут явно есть какой-то баг. Выбираю стартапы по интерфейсу могут пересекаться с другими сессиями
        List<CurrentDisplayedStartup> startups = currentDisplayedStartupRepository
                .findAllByResourceId(startupBuyDTO.getResourceId());

        if (startups.isEmpty()) {
            throw new EntityNotFoundException("Startup not found");
        }


        CurrentDisplayedStartup boughtStartup = startups.stream()
                .filter(s -> s.getSession().getId().equals(session.getId()))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Startup not found for current session"));


        currentDisplayedStartupRepository.delete(boughtStartup);



        return new StepActionDto<>(true, new StartupReadDto(startupBuyDTO.getResourceId(),
                startup.getNicheId(), startup.getName(), startup.getDescription()),
                "", session.getStepCount());

    }

    @NeedTest
    @Transactional
    public StepActionDto<StartupSellDTO> sellStartup(String resourceId) {
        StepValidationResult validationResult = stepService.validateStep();
        if (!validationResult.isValid()) {
            return new StepActionDto<>(false, null, validationResult.getMessage(), 0);
        }

        Session session = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .get().getSessions().getLast();
        Startup startupToSell = session.getStartups().stream().filter(startup -> startup.getResId().equals(resourceId))
                .findFirst().orElseThrow();

        int salePrice = startupToSell.getSalePrice();
        Step currentStep = stepService.getCurrentStep(session);
        int newPlayerCash = currentStep.getCash() + salePrice;
        currentStep.setCash(newPlayerCash);
        session.getStartups().remove(startupToSell);
        stepService.executeStep();

        var resultDTO = new StartupSellDTO(startupToSell.getName(), salePrice);
        return new StepActionDto<>(true, resultDTO, "", session.getStepCount());
    }

    @NeedTest
    public StartupStatisticsDTO getStartupStatistics(String resourceId) {
        Startup startup = sessionService.getCurrentSession().getStartups().stream()
                .filter(st -> st.getResId().equals(resourceId)).findFirst().orElseThrow();

        return startupStatisticsMapper.map(startup);
    }
}
