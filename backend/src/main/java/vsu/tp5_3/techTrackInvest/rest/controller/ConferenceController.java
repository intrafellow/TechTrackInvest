package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vsu.tp5_3.techTrackInvest.dto.AppErrorDto;
import vsu.tp5_3.techTrackInvest.dto.ConferenceReadDto;
import vsu.tp5_3.techTrackInvest.filters.CategoryFilter;
import vsu.tp5_3.techTrackInvest.mock.mockEntities.MockConference;
import vsu.tp5_3.techTrackInvest.service.ConferenceService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class ConferenceController {
    private final ConferenceService conferenceService;

    @GetMapping
    public ResponseEntity<?> findAll(CategoryFilter categoryFilter) {
        List<ConferenceReadDto> list = conferenceService.findAll(categoryFilter);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") String id) {
        Optional<ConferenceReadDto> conferenceReadDto = conferenceService.findById(id);
        if (!conferenceReadDto.isPresent()) {
            return new ResponseEntity<>(new AppErrorDto(HttpStatus.NOT_FOUND.value(), "Events not found"),
                    HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(conferenceReadDto);
    }

    // todo
    @PostMapping("/{id}/attend")
    public ResponseEntity<?> attend(@PathVariable("id") String id) {
        return ResponseEntity.ok(id);
    }

}
