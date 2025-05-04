package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.ConferenceAttendDto;
import vsu.tp5_3.techTrackInvest.dto.ConferenceReadDto;
import vsu.tp5_3.techTrackInvest.dto.StepActionDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.mongo.ExpertiseChange;
import vsu.tp5_3.techTrackInvest.entities.postgre.*;
import vsu.tp5_3.techTrackInvest.filters.CategoryFilter;
import vsu.tp5_3.techTrackInvest.mapper.ConferenceMongoToDisplayedMapper;
import vsu.tp5_3.techTrackInvest.mapper.ConferenceReadPostgresMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ConferenceMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.ConferenceRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.CurrentDisplayedConferenceRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.ExpertiseRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;
import vsu.tp5_3.techTrackInvest.service.StepValidationResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConferenceService {
    private final ConferenceRepository conferenceRepository;
    private final ConferenceMongoRepository conferenceMongoRepository;
    private final CurrentDisplayedConferenceRepository currentDisplayedConferenceRepository;
    private final ConferenceReadPostgresMapper conferenceReadPostgresMapper;
    private final UserRepository userRepository;
    private final StepService stepService;
    private final ConferenceMongoToDisplayedMapper conferenceMongoToDisplayedMapper;
    private final EntityManager entityManager;
    // удаление отображаемых и создание рандомных

    // допилить, чтобы было получение по нише
    public List<ConferenceReadDto> findAll() {
        Session session = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .get().getSessions().getLast();
        return session.getCurrentDisplayedConferences()
                .stream()
                .map(conferenceReadPostgresMapper::map)
                .toList();
    }

    public Optional<ConferenceReadDto> findById(Long id) {
        return currentDisplayedConferenceRepository.findById(id)
                .map(conferenceReadPostgresMapper::map);
    }



    @Transactional
    public StepActionDto<ConferenceMongo> attend(ConferenceAttendDto conferenceAttendDto) {
        // Проверка возможности хода и его совершение
        StepValidationResult validationResult = stepService.validateStep();
        if (!validationResult.isValid()) {
            return new StepActionDto<>(false, null, validationResult.getMessage(), 0);
        }

        // Получение пользователя
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Получение информации о конференции
        CurrentDisplayedConference displayedConference = currentDisplayedConferenceRepository.findById(conferenceAttendDto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Conference not found"));

        ConferenceMongo conferenceMongo = conferenceMongoRepository.findById(displayedConference.getResourceId())
                .orElseThrow(() -> new EntityNotFoundException("Conference details not found"));

        // Получение текущего шага
        Session session = user.getSessions().getLast();
        Step step = session.getSteps().getLast();

        // Проверка денег
        if (step.getCash() < conferenceMongo.getEnrollPrice()) {
            return new StepActionDto<>(false, null, "Недостаточно средств", 0);
        }

        stepService.executeStep();

        // Обновление данных
        // Обновление денег
        step.setCash(step.getCash() - conferenceMongo.getEnrollPrice());

        // Обновление репутации
        step.setReputation(step.getReputation() + conferenceMongo.getGainedReputation());

        // Безопасное обновление экспертиз
        List<ExpertiseChange> expertiseChanges = conferenceMongo.getExpertiseChanges();
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


        // Сохранение конференции
        Conference conference = new Conference();
        conference.setId(conferenceMongo.getId());
        conference.setSession(session);
        conferenceRepository.save(conference);

        // удаление из отображаемых
        currentDisplayedConferenceRepository.delete(displayedConference);

        return new StepActionDto<>(true, conferenceMongo, null, validationResult.getSteps() - 1);
    }

    public List<CurrentDisplayedConference> getRandomConferencesByNiche(int count, String nicheId, Session session) {
        List<ConferenceMongo> conferenceMongos = conferenceMongoRepository.findRandomConferencesByNiche(nicheId, count);
        return conferenceMongos.stream().map(c -> conferenceMongoToDisplayedMapper.map(c, session)).toList();
    }

    public List<ConferenceReadDto> findAllByNiche(String nicheId) {
        Session session = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .get().getSessions().getLast();
        return session.getCurrentDisplayedConferences()
                .stream()
                .filter(c -> c.getNicheName().equals(nicheId))
                .map(conferenceReadPostgresMapper::map)
                .toList();
    }
}
