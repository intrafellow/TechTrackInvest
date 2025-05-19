package vsu.tp5_3.techTrackInvest.entities.mongo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Solution {

    @Field("_id")
    private String id;

    private String title;

    private String description;

    private Effect effect;

    private UserEffect userEffect;
}
