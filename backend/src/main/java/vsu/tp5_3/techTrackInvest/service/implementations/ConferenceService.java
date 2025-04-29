package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
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
    private final ExpertiseRepository expertiseRepository;



    public List<ConferenceReadDto> findAll(CategoryFilter categoryFilter) {
        Session session = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .get().getSessions().getLast();
        return session.getCurrentDisplayedConferences()
                .stream()
                .map(conferenceReadPostgresMapper::map)
                .toList();
    }

    public Optional<ConferenceReadDto> findById(Long id) {
//        Session session = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
//                .get().getSessions().getLast();
        return currentDisplayedConferenceRepository.findById(id)
                .map(conferenceReadPostgresMapper::map);
    }

    // что-то не обработалось
    @Transactional
    public StepActionDto<ConferenceMongo> attend(ConferenceAttendDto conferenceAttendDto) {
        // 1. Проверка возможности хода и его совершение
        StepValidationResult validationResult = stepService.validateStep();
        if (!validationResult.isValid()) {
            return new StepActionDto<>(false, null, validationResult.getMessage(), 0);
        }

        // 2. Получение пользователя
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // 3. Получение информации о конференции
        CurrentDisplayedConference displayedConference = currentDisplayedConferenceRepository.findById(conferenceAttendDto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Conference not found"));

        ConferenceMongo conferenceMongo = conferenceMongoRepository.findById(displayedConference.getResourceId())
                .orElseThrow(() -> new EntityNotFoundException("Conference details not found"));

        // 4. Получение текущего шага
        Session session = user.getSessions().getLast();
        Step step = session.getSteps().getLast();

        // 5. Проверка денег
        if (step.getCash() < conferenceMongo.getEnrollPrice()) {
            return new StepActionDto<>(false, null, "Недостаточно средств", 0);
        }

        // 6. Обновление данных
        // 6.1. Обновление денег
        step.setCash(step.getCash() - conferenceMongo.getEnrollPrice());

        // 6.2. Обновление репутации
        step.setReputation(step.getReputation() + conferenceMongo.getGainedReputation());

        // 6.3. Безопасное обновление экспертиз
        // посмотреть что не так
        /*List<Expertise> updatedExpertiseList = new ArrayList<>();
        for (Expertise existingExpertise : step.getExpertiseList()) {
            Expertise updatedExpertise = new Expertise();
            updatedExpertise.setId(existingExpertise.getId());
            updatedExpertise.setResourceId(existingExpertise.getResourceId());
            updatedExpertise.setValue(existingExpertise.getValue());
            updatedExpertise.setStep(step);

            for (ExpertiseChange change : conferenceMongo.getExpertiseChanges()) {
                if (existingExpertise.getResourceId().equals(change.getExpertiseId())) {
                    updatedExpertise.setValue(existingExpertise.getValue() + change.getChange());
                }
            }
            updatedExpertiseList.add(updatedExpertise);
        }

        for (Expertise expertise : step.getExpertiseList()) {
            expertiseRepository.delete(expertise);
        }
        step.getExpertiseList().clear();
        step.getExpertiseList().addAll(updatedExpertiseList);*/

        // 7. Сохранение конференции
        Conference conference = new Conference();
        conference.setId(conferenceMongo.getId());
        conference.setSession(session);
        conferenceRepository.save(conference);

        return new StepActionDto<>(true, conferenceMongo, null, validationResult.getSteps());
    }
}
