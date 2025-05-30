package vsu.tp5_3.techTrackInvest.service.implementations.strategy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
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
        return Flux.fromIterable(nicheIds)
                .flatMap(nicheId -> aiService.requestConferences(nicheId, countPerNiche))
                .flatMap(Flux::fromIterable)
                .flatMap(mongoConference -> Mono.fromCallable(() -> {
                                    mongoConference.setId(null);
                                    return conferenceMongoRepository.save(mongoConference);
                                })
                                .subscribeOn(Schedulers.boundedElastic()) // <--- важно!
                )
                .collectList()
                .block();
    }
} 