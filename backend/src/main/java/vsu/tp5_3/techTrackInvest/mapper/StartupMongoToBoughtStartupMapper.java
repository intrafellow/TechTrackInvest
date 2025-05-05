package vsu.tp5_3.techTrackInvest.mapper;

import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.entities.enums.Stage;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.Startup;

import java.util.concurrent.ThreadLocalRandom;

@Component
public class StartupMongoToBoughtStartupMapper implements Mapper<StartupMongo, Startup> {

    @Override
    public Startup map(StartupMongo object) {
        Startup startup = new Startup();
        startup.setResId(object.getId());
        startup.setNicheId(object.getNiche());
        startup.setName(object.getName());
        startup.setDescription(object.getDescription());
        startup.setSalePrice(object.getPrice());
        startup.setLastMonthRevenue(object.getLastMonthRevenue());
        startup.setExpenses(object.getExpenses());
        startup.setTeam(object.getTeam());
        startup.setBudget(object.getBudget());
        Stage currentStage = object.getStage();
        startup.setStage(currentStage);
        switch (currentStage) {
            case IDEA -> startup.setProgress(ThreadLocalRandom.current().nextInt(0 , 25));
            case MVP -> startup.setProgress(ThreadLocalRandom.current().nextInt(25 , 50));
            case MARKET -> startup.setProgress(ThreadLocalRandom.current().nextInt(50 , 75));
            case SCALE -> startup.setProgress(ThreadLocalRandom.current().nextInt(75 , 100));
            case null, default -> throw new IllegalStateException("Unexpected value: " + currentStage);
        }
        startup.setReputation(object.getReputation());
        return startup;
    }
}
