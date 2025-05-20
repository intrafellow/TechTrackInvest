package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;
import vsu.tp5_3.techTrackInvest.entities.mongo.Effect;
import vsu.tp5_3.techTrackInvest.entities.mongo.UserEffect;

@Value
public class SolutionReadDto {
    String id;
    String title;
    String description;
    Effect effect;
    UserEffect userEffect;
}
