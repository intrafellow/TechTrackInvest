package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.annotation.NeedTest;
import vsu.tp5_3.techTrackInvest.dto.StepActionDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
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
    // я тут поменял логику, чтобы убавлялось значение доступных очков действий поля в сессии stepCount
    //обновлять значения текущего степа, нам придётся в огромном количестве других мест кода, поэтому есть резон сделать
    //для этого отдельный сервис
    @NeedTest
    @Transactional
    public StepValidationResult validateAndExecuteStep() {

        // учитывать переменную степ каунт
        Session session = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .get().getSessions().getLast();
        int availableCountOfSteps = session.getStepCount();

        if (availableCountOfSteps <= 0) {
            return new StepValidationResult(false, "Все ходы завершены", null);
        }

        //теперь нужно уменьшить это значение на 1, чтобы ход был совершён
        session.setStepCount(availableCountOfSteps - 1);

        //теперь в степсРезалт будет записываться оставшееся количество ходов
        return new StepValidationResult(true, null, availableCountOfSteps - 1);
    }

}
