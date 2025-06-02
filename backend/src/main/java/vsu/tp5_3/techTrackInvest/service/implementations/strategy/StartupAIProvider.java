package vsu.tp5_3.techTrackInvest.service.implementations.strategy;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import vsu.tp5_3.techTrackInvest.entities.mongo.Contract;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.mapper.StartupMongoToDisplayedStartupMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ContractMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.mongo.StartupMongoRepository;
import vsu.tp5_3.techTrackInvest.service.implementations.AIIntegration.AIConnector;
import vsu.tp5_3.techTrackInvest.service.interfaces.AIService;
import vsu.tp5_3.techTrackInvest.service.interfaces.ContractGenerator;

import java.util.List;

//теперь эти методы будут просто запрашивать и сохранять стартапы в монго
@Component
@RequiredArgsConstructor
public class StartupAIProvider {
    private final AIService aiService;
    private final StartupMongoRepository startupMongoRepository;
    private final ContractMongoRepository contractMongoRepository;
    private final ContractGenerator contractGenerator;
    private static final Logger logger = LoggerFactory.getLogger(StartupAIProvider.class);

    public List<StartupMongo> getRandomStartups(List<String> nicheIds, int countPerNiche) {
        logger.info("Начинаем получать стартапы из нейронки из ниш {}. Из каждой по {} штук", nicheIds, countPerNiche);
        return Flux.fromIterable(nicheIds)
                .flatMap(nicheId -> aiService.requestStartups(nicheId, countPerNiche))
                .flatMap(Flux::fromIterable)
                .flatMap(startup -> Mono.fromCallable(() -> {
                                    startup.setId(null);
                                    // Сохраняем стартап
                                    StartupMongo savedStartup = startupMongoRepository.save(startup);
                                    logger.info("Сохранили в монго стартап c id {} и названием {}",
                                            savedStartup.getId(), savedStartup.getName());
                                    // Генерируем и сохраняем контракт
                                    Contract contract = contractGenerator.generateContract(savedStartup);
                                    contractMongoRepository.save(contract);
                                    logger.info("Сохранили контракт для стартапа с id {}", contract.getId());
                                    return savedStartup;
                                })
                                .subscribeOn(Schedulers.boundedElastic())
                )
                .collectList()
                .block();
    }
} 