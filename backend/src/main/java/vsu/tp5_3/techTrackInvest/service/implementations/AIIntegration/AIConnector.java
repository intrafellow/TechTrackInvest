package vsu.tp5_3.techTrackInvest.service.implementations.AIIntegration;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.mongo.CrisisMongo;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.service.interfaces.AIService;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AIConnector implements AIService {
    private final WebClient webClient;
    private static final Logger logger = LoggerFactory.getLogger(AIConnector.class);
    @Override
    public Mono<CrisisMongo> requestCrisis() {
        return webClient.post()
                .uri("/game/generate_crisis")
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    logger.error("Ошибка при на стороне нейросети при генерации кризиса: {}", response.statusCode());
                    return Mono.error(new RuntimeException("Ошибка на стороне нейросети при генерации кризиса: " + response.statusCode()));
                })
                .bodyToMono(CrisisMongo.class)
                .doOnNext(crisis -> logger.info("Получен кризис: {} - {}", crisis.getName(), crisis.getDescription()))
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .maxBackoff(Duration.ofSeconds(10))
                        .filter(throwable -> throwable instanceof WebClientResponseException.TooManyRequests))
                .switchIfEmpty(Mono.error(new RuntimeException("Не получен ответ от ии")))
                .doOnError(error -> logger.error("Не получен ответ от ИИ: {}", error.getMessage(), error));
    }

    @Override
    public Mono<List<StartupMongo>> requestStartups(String nicheId, int quantity) {
        return webClient.post()
                .uri("/game/generate_startups")
                .bodyValue(Map.of(
                    "niche", nicheId,
                    "quantity", quantity
                ))
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    logger.error("Ошибка при генерации стартапов: {}", response.statusCode());
                    return Mono.error(new RuntimeException("Ошибка при генерации стартапов: " + response.statusCode()));
                })
                .bodyToMono(new ParameterizedTypeReference<List<StartupMongo>>() {})
                .doOnNext(startups -> logger.info("Получено {} стартапов для ниши {}", startups.size(), nicheId))
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .maxBackoff(Duration.ofSeconds(10))
                        .filter(throwable -> throwable instanceof WebClientResponseException.TooManyRequests))
                .switchIfEmpty(Mono.error(new RuntimeException("Не получен ответ от ИИ при генерации стартапов")))
                .doOnError(error -> logger.error("Ошибка при генерации стартапов: {}", error.getMessage(), error));
    }

    @Override
    public Mono<List<ConferenceMongo>> requestConferences(String nicheId, int quantity) {
        return webClient.post()
                .uri("/game/generate_conferences")
                .bodyValue(Map.of(
                    "niche", nicheId,
                    "quantity", quantity
                ))
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    logger.error("Ошибка при генерации конференций: {}", response.statusCode());
                    return Mono.error(new RuntimeException("Ошибка при генерации конференций: " + response.statusCode()));
                })
                .bodyToMono(new ParameterizedTypeReference<List<ConferenceMongo>>() {})
                .doOnNext(conferences -> logger.info("Получено {} конференций для ниши {}", conferences.size(), nicheId))
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .maxBackoff(Duration.ofSeconds(10))
                        .filter(throwable -> throwable instanceof WebClientResponseException.TooManyRequests))
                .switchIfEmpty(Mono.error(new RuntimeException("Не получен ответ от ИИ при генерации конференций")))
                .doOnError(error -> logger.error("Ошибка при генерации конференций: {}", error.getMessage(), error));
    }
}
