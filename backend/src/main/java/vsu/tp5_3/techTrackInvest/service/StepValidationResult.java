package vsu.tp5_3.techTrackInvest.service;

import lombok.Value;

@Value
public class StepValidationResult {
    boolean isValid;
    String message;
    Integer steps;
}