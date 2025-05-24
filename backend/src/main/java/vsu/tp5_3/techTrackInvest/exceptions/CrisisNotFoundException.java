package vsu.tp5_3.techTrackInvest.exceptions;

public class CrisisNotFoundException extends RuntimeException {
    public CrisisNotFoundException() {
        super("Не смогли найти текущий кризис в mongoDB");
    }
}
