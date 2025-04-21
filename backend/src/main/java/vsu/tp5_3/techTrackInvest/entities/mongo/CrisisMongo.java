package vsu.tp5_3.techTrackInvest.entities.mongo;

import jakarta.persistence.Embedded;
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
@Document(collection = "crises")
public class CrisisMongo {

    @Id
    private String id;

    private String name;

    private String description;

    private Integer danger;

    @Field(name = "niches")
    private List<String> nichesId;

    private List<Solution> possibleSolutions;
}
