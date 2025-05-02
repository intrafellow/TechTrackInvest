package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.CrisisReadDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.CrisisMongo;
import vsu.tp5_3.techTrackInvest.entities.mongo.Effect;
import vsu.tp5_3.techTrackInvest.entities.mongo.Solution;
import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentCrisis;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.entities.postgre.Startup;
import vsu.tp5_3.techTrackInvest.mapper.CrisisReadMapper;
import vsu.tp5_3.techTrackInvest.mapper.CurrentCrisisMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.CrisisMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.mongo.SolutionMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.CurrentCrisisRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.StartupRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.CrisisService;

import java.util.List;
import java.util.Optional;
@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrisisServiceImpl implements CrisisService {
    private final UserRepository userRepository;
    private final CrisisMongoRepository crisisMongoRepository;
    private final CurrentCrisisRepository currentCrisisRepository;
    private final SolutionMongoRepository solutionMongoRepository;
    private final StartupRepository startupRepository;
    private final CrisisReadMapper crisisReadMapper;
    private final CurrentCrisisMapper currentCrisisMapper;
    private final EntityManager entityManager;
    @Override
    @Transactional
    public Optional<CrisisReadDto> getCrisis() {
        Session session = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow().getSessions().getLast();
        if (session.getCurrentCrisis() != null) {
            currentCrisisRepository.delete(session.getCurrentCrisis());
            session.setCurrentCrisis(null);
            entityManager.flush();
        }
        CrisisMongo crisisMongo = crisisMongoRepository.findRandomEntity();
        CurrentCrisis currentCrisis = currentCrisisMapper
                .map(crisisMongo);
        currentCrisis.setSession(session);
        session.setCurrentCrisis(currentCrisis);
        return Optional.ofNullable(crisisReadMapper.map(crisisMongo));
    }

    @Override
    @Transactional
    public void solve(String solutionId) {
        Session session = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).get().getSessions().getLast();
        CrisisMongo crisisMongo = crisisMongoRepository.findById(session.getCurrentCrisis().getCrisisId()).get();
        Solution solution = solutionMongoRepository.findById(solutionId).orElseThrow();
        Effect effect = solution.getEffect();
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
    }
}
