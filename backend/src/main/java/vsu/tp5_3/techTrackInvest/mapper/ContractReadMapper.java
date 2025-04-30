package vsu.tp5_3.techTrackInvest.mapper;

import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.ContractReadDTO;
import vsu.tp5_3.techTrackInvest.entities.mongo.Contract;

@Component
public class ContractReadMapper implements Mapper<Contract, ContractReadDTO> {
    @Override
    public ContractReadDTO map(Contract object) {
        return new ContractReadDTO(
                object.getId(),
                object.getMinPrice(),
                object.getMaxPrice()
        );
    }
}
