package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vsu.tp5_3.techTrackInvest.entities.mongo.ConferenceMongo;
import vsu.tp5_3.techTrackInvest.repositories.mongo.ConferenceMongoRepository;

import java.util.List;

@RestController
@RequestMapping("/api/v1/debug")
@RequiredArgsConstructor
public class DebugController {

    private final ConferenceMongoRepository conferenceMongoRepository;

    @GetMapping("/conferences")
    public ResponseEntity<List<ConferenceMongo>> getAllConferences() {
        return ResponseEntity.ok(conferenceMongoRepository.findAll());
    }
}