package vsu.tp5_3.techTrackInvest.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.dto.StartupListDto;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.dto.StartupShortReadDto;
import vsu.tp5_3.techTrackInvest.filters.CategoryFilter;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StartupService {
    public StartupListDto findAll(CategoryFilter categoryFilter) {
        List<StartupShortReadDto> list1 = List.of(new StartupShortReadDto("12", "gsf"),
                new StartupShortReadDto("23", "gfghhh"));
        List<StartupReadDto> list2 = List.of(
                new StartupReadDto("43", "kkkkk", "1237817"),
                new StartupReadDto("765", "iiiiii", "898888"));
        return new StartupListDto(list1, list2);
    }

    public StartupReadDto findById() {
        return null;

    }
}
