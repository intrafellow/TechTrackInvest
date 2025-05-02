package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.entities.mongo.CrisisMongo;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentCrisis;
@Component
@RequiredArgsConstructor
public class CurrentCrisisMapper implements Mapper<CrisisMongo, CurrentCrisis>{
    @Override
    public CurrentCrisis map(CrisisMongo object) {
        CurrentCrisis currentCrisis = new CurrentCrisis();
        currentCrisis.setCrisisId(object.getId());
        return currentCrisis;
    }
}
