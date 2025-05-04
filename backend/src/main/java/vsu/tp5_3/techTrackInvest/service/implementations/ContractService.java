package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.ContractDealDTO;
import vsu.tp5_3.techTrackInvest.dto.ContractReadDTO;
import vsu.tp5_3.techTrackInvest.dto.StepActionDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.Contract;
import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;
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
    private final StepService stepService;
    private final UserRepository userRepository;

    public ContractReadDTO getContractByStartupId(String startupId) {
        var contract = contractMongoRepository.findByStartupId(startupId).orElseThrow(
                () -> new EntityNotFoundException("Contract for current startup id is not found %s")
        );
        return contractReadMapper.map(contract);
    }

    public int getFinalContractPrice(int rollResult, int minPrice, int maxPrice, int suggestedPrice) {
//        return (int) (maxPrice - ((double) (rollResult - 1) / 19) * (maxPrice - minPrice));
        if (suggestedPrice > maxPrice || suggestedPrice < minPrice) {
            throw new IllegalArgumentException("Suggested price cannot be greater than max price");
        }

        int delta = maxPrice - suggestedPrice;
        int badCasePrice = (int) (suggestedPrice + delta * ((double) (rollResult - 1) / 19));
        return (rollResult < 10) ? suggestedPrice : badCasePrice;
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
        AppUser user = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        CurrentDisplayedStartup startup = user.getSessions().getLast().getCurrentDisplayedStartups().stream().filter(c -> c.getResourceId().equals(startupResourceId)).findFirst().get();
        Pair<Integer, Integer> contractEffects = getEffectsFromContract(rollResult, contract);

        String messageDescription;
        if (rollResult < 10) {
            messageDescription = "Вам повезло, Вы смогли продавить свои условия сделки";
        } else {
            messageDescription = "К сожалению, Вы не смогли продавить свои условия сделки";
        }

        String startupName = startup.getName();

        stepService.executeStep();
        ContractDealDTO conditions = new ContractDealDTO(contractId, startupResourceId,
                startupName, messageDescription, finalContractPrice, rollResult,
                contractEffects.getLeft(), contractEffects.getRight());

        return new StepActionDto<>(true, conditions, "", stepCheck.getSteps() - 1);

    }

    public Pair<Integer, Integer> getEffectsFromContract(int rollResult, Contract contract) {
        int teamEffect = contract.getTeamEffect();
        int reputationEffect = contract.getReputationEffect();

        int factor = (rollResult < 11) ? -1 : 1;
        teamEffect *= ((rollResult - 1) /19) * factor;
        reputationEffect *= ((rollResult - 1) /19) * factor;

        return new ImmutablePair<>(teamEffect, reputationEffect);
    }
}
