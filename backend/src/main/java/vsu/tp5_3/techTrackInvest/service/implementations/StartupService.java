package vsu.tp5_3.techTrackInvest.service.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.StartupListDto;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.dto.StartupShortReadDto;
import vsu.tp5_3.techTrackInvest.filters.CategoryFilter;
import vsu.tp5_3.techTrackInvest.mapper.StartupReadMapper;
import vsu.tp5_3.techTrackInvest.mapper.StartupShortReadMapper;
import vsu.tp5_3.techTrackInvest.mock.mockRepository.MockStartupRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StartupService {
    private final MockStartupRepository startupRepository;
    private final StartupReadMapper startupReadMapper;
    private final StartupShortReadMapper startupShortReadMapper;
    public StartupListDto findAll(CategoryFilter categoryFilter) {
        List<StartupShortReadDto> list1 = startupRepository.findPurchased(categoryFilter)
                .stream()
                .map(startupShortReadMapper::map)
                .toList();
        List<StartupReadDto> list2 = startupRepository.findAvailable(categoryFilter)
                .stream()
                .map(startupReadMapper::map)
                .toList();
        return new StartupListDto(list1, list2);
    }

    /** По репозиториям что откуда тягается надо фиксить */
    public StartupReadDto findById() {
        return null;
    }
}
