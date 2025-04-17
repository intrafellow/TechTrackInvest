package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;

@Value
public class ConferenceReadDto {
    String id;
    String name;
    String description;
    Integer categoryId;
}
