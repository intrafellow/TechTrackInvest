package vsu.tp5_3.techTrackInvest.mapper;

import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.StartupStatisticsDTO;
import vsu.tp5_3.techTrackInvest.entities.postgre.Startup;

@Component
public class StartupStatisticsMapper implements Mapper<Startup, StartupStatisticsDTO> {
    @Override
    public StartupStatisticsDTO map(Startup object) {
        return new StartupStatisticsDTO(
                object.getName(),
                object.getDescription(),
                object.getSalePrice(),
                object.getExpenses(),
                object.getLastMonthRevenue(),
                object.getTeam(),
                object.getBudget(),
                object.getProgress(),
                object.getReputation(),
                object.getStage()
        );
    }
}
