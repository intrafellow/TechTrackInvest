package vsu.tp5_3.techTrackInvest.exceptions;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException() {
        super("Пользователь не был найден. Проверьте jwt токен");
    }
}
