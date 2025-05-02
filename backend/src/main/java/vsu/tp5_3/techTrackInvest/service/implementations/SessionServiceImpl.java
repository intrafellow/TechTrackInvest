package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.annotation.NeedTest;
import vsu.tp5_3.techTrackInvest.dto.FinishDto;
import vsu.tp5_3.techTrackInvest.dto.SessionReadDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.mongo.NicheMongo;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.*;
import vsu.tp5_3.techTrackInvest.mapper.SessionReadMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ConferenceMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.mongo.NicheMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.mongo.StartupMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.SessionRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;
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
    private static final int DEFAULT_ACTION_POINTS_PER_STEP = 5;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final SessionReadMapper sessionReadMapper;
    private final ConferenceMongoRepository conferenceMongoRepository;
    private final NicheMongoRepository nicheMongoRepository;
    private final StartupMongoRepository startupMongoRepository;
    private final ConferenceService conferenceService;

    @NeedTest
    @Override
    @Transactional
    public Optional<SessionReadDto> creteSession() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        Session session = new Session();
        session.setAppUser(user);
        session.setMonthCount(0);
        session.setStepCount(DEFAULT_ACTION_POINTS_PER_STEP);
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

        // стартуем с первой ниши? и где рандом?

        /*List<CurrentDisplayedConference> currentDisplayedConferences = getRandomConferencesIntoNiche(1, "niche-1", session)
                .stream().map(c -> convertToDisplayedConference(c, session)).toList();
        session.setCurrentDisplayedConferences(currentDisplayedConferences);*/
        /** Учитывать уже посещенные конференции и не отображать их, но будет ли такое количество конференций? */
        List<CurrentDisplayedConference> newCurrentDisplayedConferences = conferenceService.getRandomConferencesByNiche(5, session);
        if (session.getCurrentDisplayedConferences() != null) {
            session.getCurrentDisplayedConferences().clear();
            session.getCurrentDisplayedConferences().addAll(newCurrentDisplayedConferences);
        } else {
            session.setCurrentDisplayedConferences(newCurrentDisplayedConferences);
        }


        List<CurrentDisplayedStartup> startups = getRandomStartupsIntoNiche(1, "niche-1", session)
                .stream().map(startupMongo -> convertToDisplayedStartup(startupMongo, session)).toList();
        if (session.getCurrentDisplayedStartups() != null) {
            session.getCurrentDisplayedStartups().clear();
            session.getCurrentDisplayedStartups().addAll(startups);
        } else {
            session.setCurrentDisplayedStartups(startups);
        }



        session.setConferences(new ArrayList<>());
        session.setStartups(new ArrayList<>());
        //не знаю может лучше не делать
//        session.setCurrentCrisis(null);
        session.setCrisisHistory(new ArrayList<>());

        return Optional.ofNullable(sessionReadMapper.map(sessionRepository.save(session)));
    }

    //вообще мы же должны получать определённое количество конференций(4 с каждой категории). Первый раз по 4, потом
    //если сходил на какую-то то вместое неё одну. Тоже самое относится и к стартапам.

    @NeedTest
    public List<ConferenceMongo> getRandomConferencesIntoNiche(int count, String nicheId, Session session) {
        /*Pageable pageable = PageRequest.of(0, count);
        return conferenceMongoRepository.findByNicheId(nicheId, pageable);*/
        return conferenceMongoRepository.findAll();
    }

    @NeedTest
    public List<StartupMongo> getRandomStartupsIntoNiche(int count, String nicheId, Session session) {
        Pageable pageable = PageRequest.of(0, count);

        return startupMongoRepository.findByNiche(nicheId, pageable);

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

    public CurrentDisplayedConference convertToDisplayedConference(ConferenceMongo mongoConf, Session session) {
        CurrentDisplayedConference displayed = new CurrentDisplayedConference();
        displayed.setResourceId(mongoConf.getId());
        displayed.setName(mongoConf.getName());
        displayed.setDescription(mongoConf.getDescription());
        displayed.setNicheName(mongoConf.getNicheId());
        displayed.setEnrollPrice(mongoConf.getEnrollPrice());
        displayed.setSession(session);
        return displayed;
    }

    public CurrentDisplayedStartup convertToDisplayedStartup(StartupMongo mongoStartup, Session session) {
        CurrentDisplayedStartup displayed = new CurrentDisplayedStartup();

        displayed.setResourceId(mongoStartup.getId());
        displayed.setName(mongoStartup.getName());
        displayed.setDescription(mongoStartup.getDescription());
        displayed.setPrice(mongoStartup.getPrice());
        displayed.setNicheId(mongoStartup.getNiche());
        displayed.setSession(session);

        return displayed;
    }
}
