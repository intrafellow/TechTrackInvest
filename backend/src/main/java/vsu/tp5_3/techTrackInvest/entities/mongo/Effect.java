package vsu.tp5_3.techTrackInvest.entities.mongo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Effect {
    @Field(name = "price")
    private Integer priceDelta;
    @Field(name = "expenses")
    private Integer expensesDelta;
    @Field(name = "team")
    private Integer teamDelta;
    @Field(name = "progress")
    private Integer progressDelta;
    @Field(name = "reputation")
    private Integer reputationDelta;
}
