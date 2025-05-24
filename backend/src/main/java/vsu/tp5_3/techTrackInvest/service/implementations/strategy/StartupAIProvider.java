package vsu.tp5_3.techTrackInvest.service.implementations.strategy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vsu.tp5_3.techTrackInvest.entities.mongo.Contract;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.mapper.StartupMongoToDisplayedStartupMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ContractMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.mongo.StartupMongoRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.AIService;
import vsu.tp5_3.techTrackInvest.service.interfaces.ContractGenerator;
import vsu.tp5_3.techTrackInvest.service.interfaces.StartupProvider;

import java.util.ArrayList;
import java.util.List;

//теперь эти методы будут просто запрашивать и сохранять стартапы в монго
@Component
@RequiredArgsConstructor
public class StartupAIProvider {
    private final AIService aiService;
    private final StartupMongoRepository startupMongoRepository;
    private final ContractMongoRepository contractMongoRepository;
    private final StartupMongoToDisplayedStartupMapper startupMongoToDisplayedStartupMapper;
    private final ContractGenerator contractGenerator;

    public List<StartupMongo> getRandomStartups(List<String> nicheIds, int countPerNiche) {
        List<StartupMongo> result = new ArrayList<>();
        
        // Создаем Flux для каждой ниши и объединяем результаты
        Flux.fromIterable(nicheIds)
            .flatMap(nicheId -> aiService.requestStartups(nicheId, countPerNiche))
            .flatMap(startups -> {
                // Параллельно обрабатываем каждый стартап
                return Flux.fromIterable(startups)
                        .flatMap(startup -> {
                            // Сохраняем стартап
                            StartupMongo savedStartup = startupMongoRepository.save(startup);
                            
                            // Генерируем и сохраняем контракт
                            Contract contract = contractGenerator.generateContract(savedStartup);
                            contractMongoRepository.save(contract);
                            
                            return Mono.just(savedStartup);
                        }).collectList()
                        .doOnNext(result::addAll);
            }).blockLast(); // Блокируем выполнение до получения всех результатов
        
        return result;
    }
} 