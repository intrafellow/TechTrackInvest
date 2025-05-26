package vsu.tp5_3.techTrackInvest.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ConferenceMongoRepository;
import vsu.tp5_3.techTrackInvest.repositories.mongo.StartupMongoRepository;
import vsu.tp5_3.techTrackInvest.service.implementations.StartupService;

import java.util.List;

@Tag(name = "Отладка", description = "Никак не задействуется в приложении напрямую")
@RestController
@RequestMapping("/api/v1/debug")
@RequiredArgsConstructor
public class DebugController {
    private final ConferenceMongoRepository conferenceMongoRepository;
    private final StartupMongoRepository startupMongoRepository;
    private final StartupService startupService;

    @GetMapping("/conferences")
    public ResponseEntity<List<ConferenceMongo>> getAllConferences() {
        return ResponseEntity.ok(conferenceMongoRepository.findAll());
    }

    @GetMapping("/startups")
    public ResponseEntity<List<StartupMongo>> getAllStartups() {
        return ResponseEntity.ok(startupMongoRepository.findAll());
    }

    @GetMapping("/healthAPI")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("it is working");
    }

}