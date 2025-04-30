package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vsu.tp5_3.techTrackInvest.dto.ContractDealDTO;
import vsu.tp5_3.techTrackInvest.dto.ContractReadDTO;
import vsu.tp5_3.techTrackInvest.service.implementations.ContractService;
import vsu.tp5_3.techTrackInvest.service.implementations.RollService;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/contract")
public class ContractController {
    private final ContractService contractService;
    private final RollService rollService;

    @GetMapping("/{startupId}")
    public ResponseEntity<ContractReadDTO> getContract(@PathVariable String startupId) {
        ContractReadDTO result = contractService.getContractByStartupId(startupId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/finalCondition")
    public ResponseEntity<ContractDealDTO> getFinalCondition(@RequestParam String contractId,
                                                             @RequestParam Integer minPrice,
                                                             @RequestParam Integer maxPrice) {
        int diceRollResult = rollService.getDiceRollResult();
        int finalPrice = contractService.getFinalContractPrice(diceRollResult, minPrice, maxPrice);
        var resultConditionsDTO = contractService.getContractFinalConditions(contractId, diceRollResult, finalPrice);

        return ResponseEntity.ok(resultConditionsDTO);
    }
}
