package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.FinishDto;
import vsu.tp5_3.techTrackInvest.dto.SessionReadDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.mongo.NicheMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.*;
import vsu.tp5_3.techTrackInvest.mapper.SessionReadMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ConferenceMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.mongo.NicheMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.SessionRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;
import vsu.tp5_3.techTrackInvest.service.StepValidationResult;
import vsu.tp5_3.techTrackInvest.service.interfaces.SessionService;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SessionServiceImpl implements SessionService {
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final SessionReadMapper sessionReadMapper;
    private final ConferenceMongoRepository conferenceMongoRepository;
    private final NicheMongoRepository nicheMongoRepository;


    @Override
    @Transactional
    public Optional<SessionReadDto> creteSession() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
        Session session = new Session();
        session.setAppUser(user);
        session.setMonthCount(0);
        session.setStepCount(0);
        session.setStartDate(new Timestamp(System.currentTimeMillis()));
        session.setSteps(new ArrayList<>());
        Step step = new Step();
        step.setReputation(50);
        step.setCash(1000000);
        step.setSequenceNumber(1);
        List<Expertise> expertiseList = new ArrayList<>();
        List<NicheMongo> nicheMongos = nicheMongoRepository.findAll();
        for (NicheMongo n : nicheMongos) {
            Expertise e = new Expertise();
            e.setValue(10);
            e.setResourceId(n.getId());
            e.setStep(step);
            expertiseList.add(e);
        }
        step.setExpertiseList(expertiseList);
        step.setSession(session);
        session.getSteps().add(step);
        session.setCurrentDisplayedConferences(getRandomConferences(0, 10, session));
        // нагенерировать стартапов?
        return Optional.ofNullable(sessionReadMapper.map(sessionRepository.save(session)));
    }

    private List<CurrentDisplayedConference> getRandomConferences(int min, int max, Session session) {
        int count = ThreadLocalRandom.current().nextInt(min, max + 1);
        List<ConferenceMongo> allConferences = conferenceMongoRepository.findAll();
        Collections.shuffle(allConferences);

        return allConferences.stream()
                .limit(count)
                .map(conference -> convertToDisplayedConference(conference, session))
                .collect(Collectors.toList());
    }


    @Override
    @Transactional
    public Optional<FinishDto> finishSession() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long id = userRepository.findByEmail(email).get().getSessions().getLast().getId();
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.getSessions().clear();
        //sessionRepository.deleteByAppUser(user);
        return Optional.of(new FinishDto(id));

    }

    private CurrentDisplayedConference convertToDisplayedConference(ConferenceMongo mongoConf, Session session) {
        CurrentDisplayedConference displayed = new CurrentDisplayedConference();
        displayed.setResourceId(mongoConf.getId());
        displayed.setName(mongoConf.getName());
        displayed.setDescription(mongoConf.getDescription());
        displayed.setNicheName(mongoConf.getNicheId());
        displayed.setEnrollPrice(mongoConf.getEnrollPrice());
        displayed.setSession(session);
        return displayed;
    }
}
