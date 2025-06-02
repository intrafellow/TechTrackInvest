package vsu.tp5_3.techTrackInvest.exceptions.handlers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import vsu.tp5_3.techTrackInvest.exceptions.SessionNotFoundException;
import vsu.tp5_3.techTrackInvest.exceptions.UserNotFoundException;

@RestControllerAdvice
public class ExHandler {
    @ExceptionHandler(SessionNotFoundException.class)
    public ResponseEntity<?> handleNotFoundSession(SessionNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleNotFoundUser(UserNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}
