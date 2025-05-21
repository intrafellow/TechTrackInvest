package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.FinishDto;
import vsu.tp5_3.techTrackInvest.dto.SessionReadDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.NicheMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.*;
import vsu.tp5_3.techTrackInvest.mapper.SessionReadMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.NicheMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.SessionRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.ConferenceProvider;
import vsu.tp5_3.techTrackInvest.service.interfaces.SessionService;
import vsu.tp5_3.techTrackInvest.service.interfaces.StartupProvider;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SessionServiceImpl implements SessionService {
    private static final int DEFAULT_ACTION_POINTS_PER_STEP = 5;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final SessionReadMapper sessionReadMapper;
    private final NicheMongoRepository nicheMongoRepository;
    private final ConferenceProvider conferenceProvider;
    private final StartupProvider startupProvider;


    @Override
    @Transactional
    public Optional<SessionReadDto> creteSession() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
        if (user.getSessions() != null) {
            user.getSessions().clear();
        }

        Session session = new Session();
        session.setAppUser(user);
        session.setMonthCount(0);
        session.setStepCount(DEFAULT_ACTION_POINTS_PER_STEP);
        session.setStartDate(new Timestamp(System.currentTimeMillis()));
        session.setSteps(new ArrayList<>());

        Step step = new Step();
        step.setReputation(10);
        step.setCash(70000);
        step.setSequenceNumber(1);

        List<Expertise> expertiseList = new ArrayList<>();
        List<NicheMongo> nicheMongo = nicheMongoRepository.findAll();
        List<String> nicheIds = nicheMongo.stream().map(NicheMongo::getName).toList();

        for (String nicheId : nicheIds) {
            Expertise e = new Expertise();
            e.setValue(10);
            e.setResourceId(nicheId);
            e.setStep(step);
            expertiseList.add(e);
        }
        step.setExpertiseList(expertiseList);
        step.setSession(session);
        session.getSteps().add(step);


        var newRandomConferences = conferenceProvider.getRandomConferences(nicheIds, 4);
        List<CurrentDisplayedConference> currentDisplayedConferences = new ArrayList<>(newRandomConferences);
        session.setCurrentDisplayedConferences(currentDisplayedConferences);

        var newRandomStartups = startupProvider.getRandomStartups(nicheIds, 4);
        List<CurrentDisplayedStartup> currentDisplayedStartups = new ArrayList<>(newRandomStartups);
        session.setCurrentDisplayedStartups(currentDisplayedStartups);

        session.setConferences(new ArrayList<>());
        session.setStartups(new ArrayList<>());
        session.setCrisisHistory(new ArrayList<>());

        return Optional.ofNullable(sessionReadMapper.map(sessionRepository.save(session)));
    }

    @Override
    @Transactional
    public Optional<FinishDto> finishSession() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long id = userRepository.findByEmail(email).get().getSessions().getLast().getId();
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.getSessions().clear();
        return Optional.of(new FinishDto(id));
    }

    @Override
    @Transactional
    public Optional<SessionReadDto> loadSession() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Юзер не найден по этой почте: " + email));

        Session session = sessionRepository.findTopByAppUserOrderByStartDateDesc(user)
                .orElseThrow(() -> new EntityNotFoundException("Сессия для этого пользователя не создана: " + email));

        return Optional.ofNullable(sessionReadMapper.map(session));
    }
}
