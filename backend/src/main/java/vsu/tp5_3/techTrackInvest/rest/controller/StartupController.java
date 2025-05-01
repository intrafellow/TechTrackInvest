package vsu.tp5_3.techTrackInvest.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vsu.tp5_3.techTrackInvest.dto.*;
import vsu.tp5_3.techTrackInvest.service.implementations.StartupService;

import java.util.List;

@Tag(name = "Управление стартапами", description = "Предоставляем основные методы игры по работе " +
        "со стартапами(покупка, продажа, получение экспертизы")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/startups")
public class StartupController {
    private final StartupService startupService;

    @Operation(
            summary = "Возвращает все стартапы",
            description = "Вернёт список стартапов неотсортированный по нишам для общего отображения, " +
                    "где будут уже купленные игроком и те, что он может купить на этом ходу"
    )
    @GetMapping
    public StartupListDto findAll() {
        return startupService.getAllAvailableStartups();
    }


    @Operation(
            summary = "Отсортированные по нише стартапы, предлагаемые к покупке"
    )
    @GetMapping("/niche/{nicheId}")
    public ResponseEntity<List<StartupReadDto>> findAllDisplayedByNicheId(@PathVariable String nicheId) {
        return ResponseEntity.ok(startupService.getCurrentDisplayedStartupsInNiche(nicheId));
    }

    @Operation(
            summary = "Получение детальной информации о стартапе",
            description = "Заказываем экспертизы и получаем все текущие показатели стартапа"
    )
    @GetMapping("/{resourceId}/expertise/{price}")
    public ResponseEntity<StepActionDto<StartupExpertiseDTO>> getExpertise(
            @Parameter(description = "Id стартапа для которого заказываем экспертизу. Это строка",
                    example = "startup-1") @PathVariable("resourceId") String resourceId,
                    @Parameter(description = "Цена экспертизы. У нас фиксированная 10000",
                    example = "10000") @PathVariable int price) {

        return ResponseEntity.ok(startupService.getExpertise(resourceId, price));
    }

    @Operation(
            summary = "Покупаем стартап по финальной цене после переговоров",
            description = "Происходит покупка по окончательной цене, которую мы получаем только после того, как" +
                    "получили финальную цену из за ролла кубика. Это происходит после вызова метод контроллера договор"
    )
    @PostMapping("/buy")
    public ResponseEntity<StepActionDto<StartupReadDto>> confirmContract(@RequestBody StartupBuyDTO startupBuyDTO) {
        var result = startupService.buyStartup(startupBuyDTO);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Продаём стартап по его id",
            description = "Цену стартапа можно узнать открыв его статистику. Передать необходимо его id"
    )
    @GetMapping("/sell/{startupResourceId}")
    public ResponseEntity<StepActionDto<StartupSellDTO>> sellStartup(@PathVariable String startupResourceId) {
        var infoAboutSale = startupService.sellStartup(startupResourceId);
        return ResponseEntity.ok(infoAboutSale);
    }

    @Operation(
            summary = "Получение детальной статистики о купленном стартапе",
            description = "Возвращает все текущие показатели стартапа, чтобы игрок мог понять, стоит ли его держать или лучше продать"
    )
    @GetMapping("/statistics/{startupResourceId}")
    public ResponseEntity<StartupStatisticsDTO> getStatisticsAboutPlayerStartup(@PathVariable String startupResourceId) {
        var statistics = startupService.getStartupStatistics(startupResourceId);

        return ResponseEntity.ok(statistics);
    }

}
