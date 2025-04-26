package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.StepActionDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;
import vsu.tp5_3.techTrackInvest.entities.postgre.Step;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;
import vsu.tp5_3.techTrackInvest.service.StepValidationResult;

import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StepService {
    private final int STEP_MAX = 5;
    private final UserRepository userRepository;
    @Transactional
    public StepValidationResult validateAndExecuteStep() {
        // учитывать переменную степ каунт
        Step lastStep = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .get().getSessions().getLast()
                .getSteps().getLast();
        int currentStep = lastStep
                .getSequenceNumber();

        if (currentStep >= STEP_MAX) {
            return new StepValidationResult(false, "Все ходы завершены", null);
        }

        Step newStep = new Step();
        newStep.setSequenceNumber(currentStep + 1);
        newStep.setCash(lastStep.getCash());
        newStep.setReputation(lastStep.getReputation());

        newStep.setExpertiseList(new ArrayList<>(lastStep.getExpertiseList()));
        newStep.setSession(lastStep.getSession());

        userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .get().getSessions().getLast()
                .getSteps().add(newStep);

        return new StepValidationResult(true, null, currentStep + 1);
    }

}
