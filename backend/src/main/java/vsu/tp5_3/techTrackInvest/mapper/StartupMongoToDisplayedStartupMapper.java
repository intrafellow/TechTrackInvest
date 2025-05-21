package vsu.tp5_3.techTrackInvest.mapper;

import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;

@Component
public class StartupMongoToDisplayedStartupMapper implements Mapper<StartupMongo, CurrentDisplayedStartup> {
    @Override
    public CurrentDisplayedStartup map(StartupMongo object) {
        CurrentDisplayedStartup currentDisplayedStartup = new CurrentDisplayedStartup();
        currentDisplayedStartup.setName(object.getName());
        currentDisplayedStartup.setDescription(object.getDescription());
        currentDisplayedStartup.setPrice(object.getPrice());
        currentDisplayedStartup.setNicheId(object.getNiche());
        currentDisplayedStartup.setResourceId(object.getId());
        return currentDisplayedStartup;
    }
}
