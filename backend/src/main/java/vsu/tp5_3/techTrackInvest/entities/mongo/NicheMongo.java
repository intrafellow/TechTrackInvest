package vsu.tp5_3.techTrackInvest.entities.mongo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "niches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NicheMongo {
    @Id
    private String id;
    private String name;
}
