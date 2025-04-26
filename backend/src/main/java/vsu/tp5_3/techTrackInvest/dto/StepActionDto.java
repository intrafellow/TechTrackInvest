package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;

@Value
public class StepActionDto<T> {
    boolean success;
    T content;
    String errorMessage;
    Integer stepsLeft;
    CrisisReadDto crisisReadDto;
}
