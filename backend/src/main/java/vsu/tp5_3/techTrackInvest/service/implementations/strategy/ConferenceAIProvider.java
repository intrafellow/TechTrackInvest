package vsu.tp5_3.techTrackInvest.service.implementations.strategy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ConferenceMongoRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.AIService;

import java.util.ArrayList;
import java.util.List;


//теперь эти методы будут просто запрашивать и сохранять конференции в монго    
@Component
@RequiredArgsConstructor
public class ConferenceAIProvider {
    private final AIService aiService;
    private final ConferenceMongoRepository conferenceMongoRepository;

    
    public List<ConferenceMongo> getRandomConferences(List<String> nicheIds, int countPerNiche) {
        List<ConferenceMongo> result = new ArrayList<>();
        
        // Создаем Flux для каждой ниши и объединяем результаты
        Flux.fromIterable(nicheIds)
            .flatMap(nicheId -> aiService.requestConferences(nicheId, countPerNiche))
            .flatMap(conferences -> {
                // Параллельно обрабатываем каждую конференцию
                return Flux.fromIterable(conferences)
                        .map(mongoConference -> {
                            mongoConference.setId(null);
                            conferenceMongoRepository.save(mongoConference);
                            return mongoConference;
                        })
                        .collectList()
                        .doOnNext(result::addAll);
            })
            .blockLast(); // Блокируем выполнение до получения всех результатов
        
        return result;
    }
} 