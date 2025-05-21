package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.CrisisReadDto;
import vsu.tp5_3.techTrackInvest.dto.StepActionDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.*;
import vsu.tp5_3.techTrackInvest.entities.postgre.*;
import vsu.tp5_3.techTrackInvest.exceptions.CrisisSolutionsNotFoundException;
import vsu.tp5_3.techTrackInvest.mapper.CrisisReadMapper;
import vsu.tp5_3.techTrackInvest.mapper.CurrentCrisisMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.CrisisMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.CurrentCrisisRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;
import vsu.tp5_3.techTrackInvest.service.StepValidationResult;
import vsu.tp5_3.techTrackInvest.service.interfaces.CrisisProvider;
import vsu.tp5_3.techTrackInvest.service.interfaces.CrisisService;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrisisServiceImpl implements CrisisService {
    private final CrisisMongoRepository crisisMongoRepository;
    private final CurrentCrisisRepository currentCrisisRepository;
    private final CrisisReadMapper crisisReadMapper;
    private final CurrentCrisisMapper currentCrisisMapper;
    private final EntityManager entityManager;
    private final StepService stepService;
    private final UserService userService;
    private final CrisisProvider crisisProvider;

    @Override
    @Transactional
    public Optional<CrisisReadDto> getCrisis() {
        Session session = userService.getUserDBSession();
        if (session.getCurrentCrisis() != null) {
            currentCrisisRepository.delete(session.getCurrentCrisis());
            session.setCurrentCrisis(null);
            entityManager.flush();
        }

        CrisisMongo crisisMongo = crisisProvider.getRandomCrisis();
        CurrentCrisis currentCrisis = currentCrisisMapper
                .map(crisisMongo);
        currentCrisis.setSession(session);
        session.setCurrentCrisis(currentCrisis);
        return Optional.ofNullable(crisisReadMapper.map(crisisMongo));
    }

    @Override
    @Transactional
    public StepActionDto<CrisisReadDto> solve(String solutionId) {
        StepValidationResult validationResult = stepService.validateStep();
        if (!validationResult.isValid()) {
            return new StepActionDto<>(false, null, validationResult.getMessage(), 0);
        }

        stepService.executeStep();

        Session session = userService.getUserDBSession();
        CrisisMongo crisisMongo = crisisMongoRepository.findById(session.getCurrentCrisis().getCrisisId()).get();
        Solution solution = crisisMongo.getPossibleSolutions().stream().filter(s -> s.getId().equals(solutionId))
                .findFirst().orElseThrow(
                        () -> new CrisisSolutionsNotFoundException("Не нашли решение кризиса с id " + solutionId));
        Effect effect = solution.getEffect();
        UserEffect userEffect = solution.getUserEffect();
        List<Startup> startups = session.getStartups();
        for (Startup startup : startups) {
            for (String nId : crisisMongo.getNichesId()) {
                if (startup.getNicheId().equals(nId)) {
                    startup.setSalePrice(startup.getSalePrice() + effect.getPriceDelta());
                    startup.setExpenses(startup.getExpenses() + effect.getExpensesDelta());
                    startup.setTeam(startup.getTeam() + effect.getTeamDelta());
                    startup.setProgress(startup.getProgress() + effect.getProductDelta());
                    startup.setReputation(startup.getReputation() + effect.getReputationDelta());
                }
            }
        }
        Step step = session.getSteps().getLast();
        step.setCash(step.getCash() + userEffect.getMoneyChange());
        step.setReputation(step.getReputation() + userEffect.getReputationChange());
        List<ExpertiseChange> expertiseChanges = userEffect.getExpertise();
        List<Expertise> newExpertise = new ArrayList<>(step.getExpertiseList());
        for (ExpertiseChange ec : expertiseChanges) {
            for (Expertise e : newExpertise) {
                if (e.getResourceId().equals(ec.getNicheId())) {
                    e.setValue(e.getValue() + ec.getChange());
                }
                e.setStep(step);
            }
        }
        step.getExpertiseList().clear();
        step.getExpertiseList().addAll(newExpertise);

        //TODO проверить работает ли код. В прошлый раз всё поломал
        session.setCurrentCrisis(null);
        CrisisHistory crisisHistory = new CrisisHistory();
        crisisHistory.setCrisisHistoryId(crisisMongo.getId());
        crisisHistory.setSession(session);
        session.getCrisisHistory().add(crisisHistory);

        return new StepActionDto<>(true, crisisReadMapper.map(crisisMongo), null, validationResult.getSteps() - 1);
    }
}
