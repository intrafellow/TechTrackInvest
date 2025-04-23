package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.RegistrationDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;

import java.math.BigInteger;
import java.time.LocalDate;
@Component
@RequiredArgsConstructor
public class UserCreateEditMapper implements Mapper<RegistrationDto, AppUser>{
    @Override
    public AppUser map(RegistrationDto object) {
        AppUser user = new AppUser();
        user.setEmail(object.getEmail());
        user.setUsername(object.getUsername());
        user.setPasswordHash(object.getPassword());
        user.setRegistrationDate(LocalDate.now());
        user.setLevel(1);
        user.setBalance(BigInteger.valueOf(0));
        return user;
    }
}
