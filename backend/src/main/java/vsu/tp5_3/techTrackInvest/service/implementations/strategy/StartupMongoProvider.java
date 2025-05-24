package vsu.tp5_3.techTrackInvest.service.implementations.strategy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;
import vsu.tp5_3.techTrackInvest.mapper.StartupMongoToDisplayedStartupMapper;
import vsu.tp5_3.techTrackInvest.repositories.mongo.StartupMongoRepository;
import vsu.tp5_3.techTrackInvest.service.interfaces.StartupProvider;
import vsu.tp5_3.techTrackInvest.service.interfaces.UserService;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class StartupMongoProvider implements StartupProvider {
    private final UserService userService;
    private final StartupMongoRepository startupMongoRepository;
    private final StartupMongoToDisplayedStartupMapper startupMongoToDisplayedStartupMapper;

    @Override
    public List<CurrentDisplayedStartup> getRandomStartups(List<String> nicheIds, int countPerNiche, Session session) {
        List<CurrentDisplayedStartup> startups = new ArrayList<>();

        for (String nicheId : nicheIds) {
            var newStartups = getRandomStartupsByNiche(countPerNiche, nicheId, session);
            startups.addAll(newStartups);
        }
        return startups;
    }

    private List<CurrentDisplayedStartup> getRandomStartupsByNiche(int count, String nicheId, Session session) {

        var mongoStartups = startupMongoRepository.findRandomStartupsByNiche(nicheId, count);
        return mongoStartups.stream()
                .map(mongoStartup -> {
                    var postgresStartup = startupMongoToDisplayedStartupMapper.map(mongoStartup);
                    postgresStartup.setSession(session);
                    return postgresStartup;
                }).toList();
    }
}
