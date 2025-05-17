package vsu.tp5_3.techTrackInvest.exceptions;

public class SessionNotFoundException extends RuntimeException {
    public SessionNotFoundException() {
        super("Сессия данного пользователя не была найдена. Проверьте корректность токена.");
    }
}
