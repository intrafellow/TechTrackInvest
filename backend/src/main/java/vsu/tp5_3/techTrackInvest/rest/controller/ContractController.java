package vsu.tp5_3.techTrackInvest.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vsu.tp5_3.techTrackInvest.dto.ContractDealDTO;
import vsu.tp5_3.techTrackInvest.dto.ContractReadDTO;
import vsu.tp5_3.techTrackInvest.dto.StepActionDto;
import vsu.tp5_3.techTrackInvest.service.implementations.ContractService;
import vsu.tp5_3.techTrackInvest.service.implementations.RollService;

@Tag(name = "Заключение договоров", description = "Реализует логику покупки стартапов через договоры, чтобы мы могли " +
        "получить цену стартапа после броска кубика")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/contract")
public class ContractController {
    private final ContractService contractService;
    private final RollService rollService;

    @Operation(
            summary = "Получаем условия покупки стартапа",
            description = "Возвращает какая минимальная и максимальная цена стартапа может быть. В этом диапазоне будет " +
                    "выбирать финальная сумма договора"
    )
    @GetMapping("/{startupId}")
    public ResponseEntity<ContractReadDTO> getContract(@PathVariable String startupId) {
        ContractReadDTO result = contractService.getContractByStartupId(startupId);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Получаем финальную сумму покупки стартапа после броска кубика",
            description = "Передаём сюда id договора по стартапу и диапазон, чтобы нам вернулись точные условия покупки. " +
                    "Далее уже нужно будет передать эту цену в контроллер стартапа и купить его"
    )
    @GetMapping("/finalCondition")
    public ResponseEntity<StepActionDto<ContractDealDTO>> getFinalCondition(@RequestParam String contractId,
                                                           @RequestParam Integer minPrice,
                                                           @RequestParam Integer maxPrice) {
        int diceRollResult = rollService.getDiceRollResult();
        int finalPrice = contractService.getFinalContractPrice(diceRollResult, minPrice, maxPrice);
        var resultConditionsDTO = contractService.getContractFinalConditions(contractId, diceRollResult, finalPrice);

        return ResponseEntity.ok(resultConditionsDTO);
    }
}
