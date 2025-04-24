package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.ConferenceAttendDto;
import vsu.tp5_3.techTrackInvest.dto.ConferenceReadDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.Conference;
import vsu.tp5_3.techTrackInvest.filters.CategoryFilter;
import vsu.tp5_3.techTrackInvest.mapper.ConferenceReadMapper;
import vsu.tp5_3.techTrackInvest.mock.mockRepository.MockConferenceRepository;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ConferenceMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.ConferenceRepository;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConferenceService {
    private final MockConferenceRepository mockConferenceRepository;
    private final ConferenceRepository conferenceRepository;
    private final ConferenceMongoRepository conferenceMongoRepository;
    private final ConferenceReadMapper conferenceReadMapper;

    public List<ConferenceReadDto> findAll(CategoryFilter categoryFilter) {
        return conferenceRepository.findAll().stream()
                .map(c -> conferenceMongoRepository.findById(c.getId()))
                .map(c -> c.get())
                .map(conferenceReadMapper::map)
                .toList();
    }

    public Optional<ConferenceReadDto> findById(String id) {
        return conferenceRepository.findById(id)
                .map(c -> conferenceMongoRepository.findById(c.getId()))
                .map(c -> c.get())
                .map(conferenceReadMapper::map);
    }

    @Transactional
    public void attend(ConferenceAttendDto conferenceAttendDto) {
        // проверка денег
        // вычет денег
        // прибавление характеристик
        // создаем сущность конференции для постгреса
        // сохранить
    }
}
