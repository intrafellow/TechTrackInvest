package vsu.tp5_3.techTrackInvest.exceptions;

public class LastStepNotFoundException extends RuntimeException {
    public LastStepNotFoundException(String message) {
        super("Произошла ошибка во время получения данных о последнем шаге. " + message);
    }
}
