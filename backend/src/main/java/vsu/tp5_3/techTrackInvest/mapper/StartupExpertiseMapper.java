package vsu.tp5_3.techTrackInvest.mapper;

import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.StartupExpertiseDTO;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;

@Component
public class StartupExpertiseMapper implements Mapper<StartupMongo, StartupExpertiseDTO> {
    @Override
    public StartupExpertiseDTO map(StartupMongo object) {
        return new StartupExpertiseDTO(
                object.getName(),
                object.getDescription(),
                object.getPrice(),
                object.getUniqueProductOffer(),
                object.getLastMonthRevenue(),
                object.getExpenses(),
                object.getTeam(),
                object.getBudget(),
                object.getProduct(),
                object.getReputation(),
                object.getLevel(),
                object.getStage()
        );
    }
}
