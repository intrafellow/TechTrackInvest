package vsu.tp5_3.techTrackInvest.entities.mongo;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import vsu.tp5_3.techTrackInvest.entities.enums.Stage;

@Document(collection = "startups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StartupMongo {
    @Id
    private String id;
    private String name;
    private String description;
    private Integer price;
    private String uniqueProductOffer;
    private Integer lastMonthRevenue;
    private Integer expenses;
    private Integer team;
    private Integer budget;
    private Integer product;
    private Integer reputation;
    private Integer level;
    private Stage stage;

    //хранится индентификатор ниши, к которой относится стартап
    // я тут немного изменил название поля в монго, раньше оно было niche. Нужно проверить не поломается ли база.
    private String niche;
}
