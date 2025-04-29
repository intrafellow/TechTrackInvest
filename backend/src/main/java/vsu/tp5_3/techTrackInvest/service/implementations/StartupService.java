package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.annotation.Tested;
import vsu.tp5_3.techTrackInvest.dto.StartupExpertiseDTO;
import vsu.tp5_3.techTrackInvest.dto.StartupListDto;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.dto.StepActionDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.entities.postgre.Startup;
import vsu.tp5_3.techTrackInvest.entities.postgre.Step;
import vsu.tp5_3.techTrackInvest.mapper.DisplayedStartupReadMapper;
import vsu.tp5_3.techTrackInvest.mapper.StartupExpertiseMapper;
import vsu.tp5_3.techTrackInvest.mapper.StartupReadMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.StartupMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.CurrentDisplayedStartupRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.SessionRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.StartupRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;
import vsu.tp5_3.techTrackInvest.service.StepValidationResult;

import java.util.*;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StartupService {
    private final StartupRepository startupRepository;
    private final StartupMongoRepository startupMongoRepository;
    private final NicheService nicheService;
    private final CurrentDisplayedStartupRepository currentDisplayedStartupRepository;
    private final SessionRepository sessionRepository;
    private final DisplayedStartupReadMapper displayedStartupReadMapper;
    private final StartupReadMapper startupReadMapper;
    private final UserRepository userRepository;
    private final StepService stepService;
    private final StartupExpertiseMapper startupExpertiseMapper;
    //это всё как я понимаю нам особо не нужно. Тут одни моки
//    private final MockStartupRepository startupRepository;
//    private final StartupReadMapper startupReadMapper;
//    private final StartupShortReadMapper startupShortReadMapper;
//    public StartupListDto findAll(CategoryFilter categoryFilter) {
//        List<StartupShortReadDto> list1 = startupRepository.findPurchased(categoryFilter)
//                .stream()
//                .map(startupShortReadMapper::map)
//                .toList();
//        List<StartupReadDto> list2 = startupRepository.findAvailable(categoryFilter)
//                .stream()
//                .map(startupReadMapper::map)
//                .toList();
//        return new StartupListDto(list1, list2);
//    }

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
        List<Startup> allBoughtStartups = startupRepository.findAll();
        List<CurrentDisplayedStartup> allReadyToBuyStartups = currentDisplayedStartupRepository.findAll();

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
        session.getStartups().forEach(startup -> usedStartupIds.add(startup.getId()));

        List<CurrentDisplayedStartup> resultNewStartups = new ArrayList<>();

        PageRequest pageRequest = PageRequest.of(0, startupsCount);
        List<StartupMongo> retrievedStartups = startupMongoRepository.findAllByNicheAndIdNotIn(nicheId,
                new ArrayList<>(usedStartupIds), pageRequest);

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

    //нужен метод который будет отвечать за покупку стартапа.Реализую его чуть позже



    //Метод, который отвечает за экспертизу
    @Transactional
    public StepActionDto<StartupExpertiseDTO> getExpertise(String resourceId, int expertisePrice) {
        //логично было бы сделать ограничения на покупку экспертизы на один и тот же стартап на одном ходу
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
        if (currentPlayerCash < expertisePrice) return new StepActionDto<>(false, null,
                "Недостаточно средств для покупки экспертизы", validationResult.getSteps());

        currentPlayerCash -= expertisePrice;
        currentStep.setCash(currentPlayerCash);
        stepService.executeStep();
        StartupExpertiseDTO startupExpertiseDTO = startupExpertiseMapper.map(originalStartup);
        return new StepActionDto<>(true, startupExpertiseDTO, null,
                validationResult.getSteps() - 1);
    }


    /**
     * По репозиториям что откуда тягается надо фиксить
     */
    public StartupReadDto findById() {
        return null;
    }
}
