package vsu.tp5_3.techTrackInvest.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "Управление конференциями", description = "Предоставляет все апи для посещения, просмотра конференций")
@RestController
@RequestMapping("/api/v1/conference")
@RequiredArgsConstructor
public class ConferenceController {
    private final ConferenceService conferenceService;
    private final UserServiceImpl userService;

    @Operation(
            summary = "Получаем все доступные для посещения конференции"
    )
    @GetMapping
    public ResponseEntity<List<ConferenceReadDto>> findAll(CategoryFilter categoryFilter) {
        List<ConferenceReadDto> list = conferenceService.findAll(categoryFilter);
        return ResponseEntity.ok(list);
    }

    @Operation(
            summary = "Получаем конференцию по её id(число) из постгреса"
    )
    @GetMapping("/{id}")
    public ResponseEntity<ConferenceReadDto> findById(@PathVariable("id") Long id) {
        return conferenceService.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Событие не найдено"
                ));
    }


    @Operation(
            summary = "Посещаем конференцию по её id"
    )
    @PostMapping("/{id}/attend")
    public ResponseEntity<StepActionDto<ConferenceMongo>> attend(@Parameter(description = "id конференции, которую хотим посетить", example = "3")
                                                                     @PathVariable("id") Long id) {
        ConferenceAttendDto conferenceAttendDto = new ConferenceAttendDto(id, SecurityContextHolder.getContext().getAuthentication().getName());
        StepActionDto<ConferenceMongo> conferenceReadDtoStepActionDto = conferenceService.attend(conferenceAttendDto);
        return ResponseEntity.ok(conferenceReadDtoStepActionDto);
    }

}
