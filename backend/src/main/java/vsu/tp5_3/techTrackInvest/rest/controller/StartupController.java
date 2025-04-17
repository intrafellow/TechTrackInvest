package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vsu.tp5_3.techTrackInvest.dto.AppErrorDto;
import vsu.tp5_3.techTrackInvest.dto.ExpertiseReadDto;
import vsu.tp5_3.techTrackInvest.dto.StartupListDto;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.filters.CategoryFilter;
import vsu.tp5_3.techTrackInvest.service.ExpertiseService;
import vsu.tp5_3.techTrackInvest.service.StartupService;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/startups")
public class StartupController {
    private final StartupService startupService;
    private final ExpertiseService expertiseService;

    @GetMapping
    public StartupListDto findAll(CategoryFilter categoryFilter) {
        return startupService.findAll(categoryFilter);
    }

    /** пусть сервер наверное сам решает какой стартап возвращать, т.е
     * проверяет куплен он или нет тут
     * */

    @GetMapping("/{id}")
    public StartupReadDto findById() {
        return startupService.findById();
    }

    @GetMapping("/{id}/expertise")
    public ResponseEntity<?> getExpertise(@PathVariable("id") String id) {
        Optional<ExpertiseReadDto> expertiseReadDto = expertiseService.getExpertise(id);
        if (!expertiseReadDto.isPresent()) {
            return new ResponseEntity<>(new AppErrorDto(HttpStatus.NOT_FOUND.value(), "Startup not found"),
                    HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(expertiseReadDto);
    }

}
