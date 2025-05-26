package vsu.tp5_3.techTrackInvest.service.implementations.strategy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.entities.mongo.CrisisMongo;
import vsu.tp5_3.techTrackInvest.repositories.mongo.CrisisMongoRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.AIService;

@Component
@RequiredArgsConstructor
public class CrisisAIProvider {
    private final AIService aiService;
    private final CrisisMongoRepository crisisMongoRepository;

    //проверить чтобы эта хрень точно не возвращала пустое значение
    public CrisisMongo getRandomCrisis() {
        CrisisMongo crisisMongo = aiService.requestCrisis().block(); // всё равно блокируемся
        return crisisMongoRepository.save(crisisMongo);
    }
}
