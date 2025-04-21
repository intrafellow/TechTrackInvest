package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;

@Value
public class StartupReadDto {
    String id;
    Integer categoryId;
    String name;
    String description;
}
