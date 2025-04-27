package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.StartupListDto;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;
import vsu.tp5_3.techTrackInvest.entities.postgre.Startup;
import vsu.tp5_3.techTrackInvest.mapper.DisplayedStartupReadMapper;
import vsu.tp5_3.techTrackInvest.mapper.StartupReadMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.StartupMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.CurrentDisplayedStartupRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.StartupRepository;

import java.util.*;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StartupService {

    private final Set<String> usedStartupIds = new HashSet<>();
    //есть смысл сделать кеш используемых стартапов. Хранить их resourceId, чтобы не лазить в бд, а сразу доставать
    //из монги и сверять. Нужно будет правда следить, чтобы он правильно обновлялся
    private final StartupRepository startupRepository;
    private final StartupMongoRepository startupMongoRepository;
    private final NicheService nicheService;
    private final CurrentDisplayedStartupRepository currentDisplayedStartupRepository;
    private final DisplayedStartupReadMapper displayedStartupReadMapper;
    private final StartupReadMapper startupReadMapper;
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

    //нужен чтобы получать все доступные стартапы для покупки по определённой категории(в ui есть такой выбор)
    public List<StartupReadDto> getCurrentDisplayedStartupsInNiche(String nicheId) {
        return currentDisplayedStartupRepository.findAllByNicheId(nicheId).stream()
                .map(displayedStartupReadMapper::map).toList();
    }

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


//    public Optional<StartupMongo> getNewUniqueStartup(String nicheId) {
//        //должны получить все стартапы заданной категории, которые уже отображаются
//        //должны получить все стартапы заданной категории, которые мы купили
//        //должны достать из монго рандомный стартап подходящей категории
//        //проверить не используем ли мы уже этот стартап
//        //повторить поиск стартапа пока не найдём уникальный
//
//        List<CurrentDisplayedStartup> currentDisplayedStartupsInCategory =
//                currentDisplayedStartupRepository.findAllByNicheId(nicheId);
//        return
//
//    }



    /** По репозиториям что откуда тягается надо фиксить */
    public StartupReadDto findById() {
        return null;
    }
}
