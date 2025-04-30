package vsu.tp5_3.techTrackInvest.entities.mongo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@AllArgsConstructor
public class ExpertiseChange {
    @Field(name = "nicheId")
    private String expertiseId;
    private Integer change;
}
