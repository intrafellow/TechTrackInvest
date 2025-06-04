package vsu.tp5_3.techTrackInvest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vsu.tp5_3.techTrackInvest.entities.mongo.NicheMongo;
import vsu.tp5_3.techTrackInvest.repositories.mongo.NicheMongoRepository;
import vsu.tp5_3.techTrackInvest.service.implementations.strategy.ConferenceAIProvider;
import vsu.tp5_3.techTrackInvest.service.implementations.strategy.StartupAIProvider;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Tag(name = "Генерация данных", description = "API для запуска генерации стартапов и конференций")
@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/generator")
public class DataGeneratorController {
    private final StartupAIProvider startupAIProvider;
    private final ConferenceAIProvider conferenceAIProvider;
    private final NicheMongoRepository nicheMongoRepository;
    @Qualifier("taskExecutor")
    private final Executor taskExecutor;

    @Operation(
            summary = "Запуск генерации стартапов",
            description = "Асинхронно запускает генерацию стартапов для указанных ниш"
    )
    @PostMapping("/startups")
    public ResponseEntity<String> generateStartups() {
        CompletableFuture.runAsync(() -> {
            try {
                List<String> nicheIds = nicheMongoRepository.findAll().stream().map(NicheMongo::getName).toList();
                List<String> niche = List.of(nicheIds.get(ThreadLocalRandom.current().nextInt(nicheIds.size())));
                log.info("Начало генерации стартапов для {} ниш", niche);
                startupAIProvider.getRandomStartups(niche, 1);
                
                log.info("Стартапы успешно сгенерированы");
            } catch (Exception e) {
                log.error("Ошибка при генерации стартапов: {}", e.getMessage(), e);
            }
        }, taskExecutor);

        return ResponseEntity.accepted()
                .body("Генерация стартапов запущена");
    }

    @Operation(
            summary = "Запуск генерации конференций",
            description = "Асинхронно запускает генерацию конференций для указанных ниш"
    )
    @PostMapping("/conferences")
    public ResponseEntity<String> generateConferences() {
        CompletableFuture.runAsync(() -> {
            try {

                List<String> nicheIds = nicheMongoRepository.findAll().stream().map(NicheMongo::getName).toList();
                List<String> niche = List.of(nicheIds.get(ThreadLocalRandom.current().nextInt(nicheIds.size())));
                log.info("Начало генерации конференций для ниш: {}", niche);

                log.info("Конференции успешно сгенерированы");
            } catch (Exception e) {
                log.error("Ошибка при генерации конференций: {}", e.getMessage(), e);
            }
        }, taskExecutor);

        return ResponseEntity.accepted()
                .body("Генерация конференций запущена");
    }
} 