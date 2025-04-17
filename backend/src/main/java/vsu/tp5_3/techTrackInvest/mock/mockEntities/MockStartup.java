package vsu.tp5_3.techTrackInvest.mock.mockEntities;

import lombok.Value;

import java.math.BigDecimal;
@Value
public class MockStartup {
    String id;
    Integer categoryId;
    String name;
    String description;
    BigDecimal price;
    Integer reputation;
}
