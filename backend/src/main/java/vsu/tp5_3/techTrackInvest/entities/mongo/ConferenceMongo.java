package vsu.tp5_3.techTrackInvest.entities.mongo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "conferences")
public class ConferenceMongo {
    @Id
    private String id;

    private String name;

    private String description;

    // хранится id, ссылающийся на нишу, в которой проходит эта конференция
//    @Field(name = "niche")
    private String nicheId;

    private Integer enrollPrice;

    private Integer gainedReputation;

    @Field(name = "expertise")
    private List<ExpertiseChange> expertiseChanges;
}
