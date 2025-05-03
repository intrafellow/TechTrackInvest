package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;

@Value
public class ConferenceReadDto {
    Long id;
    String resourceId;
    String name;
    String description;
    String category;
    Integer price;
}
