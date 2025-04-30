package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import vsu.tp5_3.techTrackInvest.dto.AppErrorDto;
import vsu.tp5_3.techTrackInvest.dto.ConferenceAttendDto;
import vsu.tp5_3.techTrackInvest.dto.ConferenceReadDto;
import vsu.tp5_3.techTrackInvest.dto.StepActionDto;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.filters.CategoryFilter;
import vsu.tp5_3.techTrackInvest.service.implementations.ConferenceService;
import vsu.tp5_3.techTrackInvest.service.implementations.UserServiceImpl;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/conference")
@RequiredArgsConstructor
public class ConferenceController {
    private final ConferenceService conferenceService;
    private final UserServiceImpl userService;

    @GetMapping
    public ResponseEntity<List<ConferenceReadDto>> findAll(CategoryFilter categoryFilter) {
        List<ConferenceReadDto> list = conferenceService.findAll(categoryFilter);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConferenceReadDto> findById(@PathVariable("id") Long id) {
        return conferenceService.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Событие не найдено"
                ));
    }


    @PostMapping("/{id}/attend")
    public ResponseEntity<StepActionDto<ConferenceMongo>> attend(@PathVariable("id") Long id) {
        ConferenceAttendDto conferenceAttendDto = new ConferenceAttendDto(id, SecurityContextHolder.getContext().getAuthentication().getName());
        StepActionDto<ConferenceMongo> conferenceReadDtoStepActionDto = conferenceService.attend(conferenceAttendDto);
        return ResponseEntity.ok(conferenceReadDtoStepActionDto);
    }

}
