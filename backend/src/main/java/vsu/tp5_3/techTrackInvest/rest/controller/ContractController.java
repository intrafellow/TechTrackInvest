package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vsu.tp5_3.techTrackInvest.dto.ContractReadDTO;
import vsu.tp5_3.techTrackInvest.service.implementations.ContractService;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/contract")
public class ContractController {
    private final ContractService contractService;

    @GetMapping("/{startupId}")
    public ResponseEntity<ContractReadDTO> getContract(@PathVariable String startupId) {
        ContractReadDTO result = contractService.getContractByStartupId(startupId);
        return ResponseEntity.ok(result);
    }
}
