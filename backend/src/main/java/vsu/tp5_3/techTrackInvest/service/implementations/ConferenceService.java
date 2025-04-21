package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.ConferenceAttendDto;
import vsu.tp5_3.techTrackInvest.dto.ConferenceReadDto;
import vsu.tp5_3.techTrackInvest.filters.CategoryFilter;
import vsu.tp5_3.techTrackInvest.mapper.ConferenceReadMapper;
import vsu.tp5_3.techTrackInvest.mock.mockRepository.MockConferenceRepository;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConferenceService {
    private final MockConferenceRepository mockConferenceRepository;
    private final ConferenceReadMapper conferenceReadMapper;

    public List<ConferenceReadDto> findAll(CategoryFilter categoryFilter) {
        return mockConferenceRepository.findAllForFilter(categoryFilter)
                .stream()
                .map(conferenceReadMapper::map)
                .toList();
    }

    public Optional<ConferenceReadDto> findById(String id) {
        return mockConferenceRepository.findById(id).map(conferenceReadMapper::map);
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
