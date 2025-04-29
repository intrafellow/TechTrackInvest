package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.ContractReadDTO;
import vsu.tp5_3.techTrackInvest.mapper.ContractReadMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ContractMongoRepository;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ContractService {
    private final ContractMongoRepository contractMongoRepository;
    private final ContractReadMapper contractReadMapper;

    public ContractReadDTO getContractByStartupId(String startupId) {
        var contract = contractMongoRepository.findByStartupId(startupId).orElseThrow(
                () -> new EntityNotFoundException("Contract for current startup id is not found %s")
        );
        return contractReadMapper.map(contract);
    }
}
