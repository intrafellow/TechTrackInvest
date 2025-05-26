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
import vsu.tp5_3.techTrackInvest.mapper.ConferenceMongoToDisplayedConferenceMapper;
import vsu.tp5_3.techTrackInvest.mapper.ConferenceReadPostgresMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ConferenceMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.ConferenceRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.CurrentDisplayedConferenceRepository;
import vsu.tp5_3.techTrackInvest.service.StepValidationResult;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;

import java.util.*;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConferenceService {
    private final ConferenceRepository conferenceRepository;
    private final ConferenceMongoRepository conferenceMongoRepository;
    private final CurrentDisplayedConferenceRepository currentDisplayedConferenceRepository;
    private final ConferenceReadPostgresMapper conferenceReadPostgresMapper;
    private final StepService stepService;
    private final UserService userService;
    private final ConferenceMongoToDisplayedConferenceMapper conferenceMongoToDisplayedConferenceMapper;
    // удаление отображаемых и создание рандомных

    // допилить, чтобы было получение по нише
    public List<ConferenceReadDto> findAll() {
        Session session = userService.getUserDBSession();
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
        Session session = userService.getUserDBSession();
        Step currentStep = stepService.getCurrentStep(session);

        // Получение информации о конференции
        CurrentDisplayedConference displayedConference = currentDisplayedConferenceRepository.findById(conferenceAttendDto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Conference not found"));

        ConferenceMongo conferenceMongo = conferenceMongoRepository.findById(displayedConference.getResourceId())
                .orElseThrow(() -> new EntityNotFoundException("Conference details not found"));

        // Проверка денег
        if (currentStep.getCash() < conferenceMongo.getEnrollPrice()) {
            return new StepActionDto<>(false, null, "Недостаточно средств", 0);
        }

        stepService.executeStep();

        // Обновление данных
        // Обновление денег
        currentStep.setCash(currentStep.getCash() - conferenceMongo.getEnrollPrice());

        // Обновление репутации
        currentStep.setReputation(currentStep.getReputation() + conferenceMongo.getGainedReputation());

        // Безопасное обновление экспертиз
        List<ExpertiseChange> expertiseChanges = conferenceMongo.getExpertiseChanges();
        List<Expertise> newExpertise = new ArrayList<>(currentStep.getExpertiseList());
        for (ExpertiseChange ec : expertiseChanges) {
            for (Expertise e : newExpertise) {
                if (e.getResourceId().equals(ec.getNicheId())) {
                    e.setValue(e.getValue() + ec.getChange());
                }
                e.setStep(currentStep);
            }
        }
        currentStep.getExpertiseList().clear();
        currentStep.getExpertiseList().addAll(newExpertise);


        // Сохранение конференции
        Conference conference = new Conference();
        conference.setResourceConferenceId(conferenceMongo.getId());
        conference.setSession(session);
        conferenceRepository.save(conference);

        // удаление из отображаемых
        currentDisplayedConferenceRepository.delete(displayedConference);

        return new StepActionDto<>(true, conferenceMongo, null, validationResult.getSteps() - 1);
    }



    public List<ConferenceReadDto> findAllByNiche(String nicheId) {
        Session session = userService.getUserDBSession();
        return session.getCurrentDisplayedConferences()
                .stream()
                .filter(c -> c.getNicheName().equals(nicheId))
                .map(conferenceReadPostgresMapper::map)
                .toList();
    }

    @Transactional
    public List<CurrentDisplayedConference> updateDisplayedConference(int conferencePerNiche,
                                                                      List<String> nicheIds,
                                                                      Session session) {
        Set<String> usedConfId = new HashSet<>();
        session.getCurrentDisplayedConferences().forEach(conf -> usedConfId.add(conf.getResourceId()));
        session.getConferences().forEach(conference -> usedConfId.add(conference.getResourceConferenceId()));

        List<CurrentDisplayedConference> newRandomConferences = new ArrayList<>();
        for (String nicheId : nicheIds) {
            var confs = conferenceMongoRepository.findRandomConferencesByNicheAndExcludedIds(nicheId,
                    new ArrayList<>(usedConfId), conferencePerNiche);

            newRandomConferences.addAll(confs.stream().map(mongoConf -> {
                var postgreConf = conferenceMongoToDisplayedConferenceMapper.map(mongoConf);
                postgreConf.setSession(session);
                return postgreConf;
            }).toList());
        }
        return newRandomConferences;
    }
}
