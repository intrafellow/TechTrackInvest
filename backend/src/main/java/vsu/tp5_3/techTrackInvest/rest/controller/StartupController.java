package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vsu.tp5_3.techTrackInvest.dto.StartupListDto;
import vsu.tp5_3.techTrackInvest.dto.StartupReadDto;
import vsu.tp5_3.techTrackInvest.filters.CategoryFilter;
import vsu.tp5_3.techTrackInvest.service.StartupService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/startups")
public class StartupController {
    private final StartupService startupService;
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

}
