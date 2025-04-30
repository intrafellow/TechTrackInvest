package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.ContractDealDTO;
import vsu.tp5_3.techTrackInvest.dto.ContractReadDTO;
import vsu.tp5_3.techTrackInvest.dto.StepActionDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.Contract;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.entities.postgre.Step;
import vsu.tp5_3.techTrackInvest.mapper.ContractReadMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ContractMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.CurrentDisplayedStartupRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;

import java.util.Comparator;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ContractService {
    private final ContractMongoRepository contractMongoRepository;
    private final ContractReadMapper contractReadMapper;
    private final CurrentDisplayedStartupRepository currentDisplayedStartupRepository;
    private final UserRepository userRepository;
    private final StepService stepService;

    public ContractReadDTO getContractByStartupId(String startupId) {
        var contract = contractMongoRepository.findByStartupId(startupId).orElseThrow(
                () -> new EntityNotFoundException("Contract for current startup id is not found %s")
        );
        return contractReadMapper.map(contract);
    }

    public int getFinalContractPrice(int rollResult, int minPrice, int maxPrice) {
        return (int) (maxPrice - ((double) (rollResult - 1) / 19) * (maxPrice - minPrice));
    }

    //тут добавлю интерфейс, который будет возвращать сообщение. Чтобы потом было удобно всё заменить нейронкой
    @Transactional
    public StepActionDto<ContractDealDTO> getContractFinalConditions(String contractId, int rollResult, int finalContractPrice) {
        var stepCheck = stepService.validateStep();

        if (!stepCheck.isValid()) {
            return new StepActionDto<>(false, null, stepCheck.getMessage(), 0);
        }

        Contract contract = contractMongoRepository.findById(contractId).orElseThrow(
                () -> new EntityNotFoundException("Contract not found after trying to buy"));
        String startupResourceId = contract.getStartupId();
        CurrentDisplayedStartup startup = currentDisplayedStartupRepository.findByResourceId(startupResourceId).orElseThrow();

        String messageDescription;
        if (rollResult < 7) {
            messageDescription = "Вам, к сожалению, не повезло на переговорах";
        } else if (rollResult < 14) {
            messageDescription = "Вы оказались не настолько хороши, чтобы продавить все свои условия, но Вы смогли выбить себе скидку";
        } else {
            messageDescription = "Вы очень удачливы, поэтому смогли получить максимальную скидку";
        }

        String startupName = startup.getName();

        stepService.executeStep();
        ContractDealDTO conditions = new ContractDealDTO(contractId, startupResourceId,
                startupName, messageDescription, finalContractPrice, rollResult);

        return new StepActionDto<>(true, conditions, "", stepCheck.getSteps() - 1);

    }
}
