package vsu.tp5_3.techTrackInvest.dto;

import lombok.Value;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

@Value
public class RegistrationResponse {
    String username;
    String email;
    List<Session> sessions;
    LocalDate registrationDate;
    int level;
    BigInteger balance;
    String token;
}
