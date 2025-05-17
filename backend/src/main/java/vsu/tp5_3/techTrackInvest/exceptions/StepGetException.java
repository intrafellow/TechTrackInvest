package vsu.tp5_3.techTrackInvest.exceptions;

public class StepGetException extends RuntimeException {
    public StepGetException(String message) {
        super("Произошла ошибка во время получения данных о последнем шаге. " + message);
    }
}
