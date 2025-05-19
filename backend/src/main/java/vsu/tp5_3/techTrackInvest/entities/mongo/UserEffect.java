package vsu.tp5_3.techTrackInvest.entities.mongo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class UserEffect {
    private Integer moneyChange;
    private Integer reputationChange;
    private List<ExpertiseChange> expertise;
}
