package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.UserReadDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;
@Component
@RequiredArgsConstructor
public class UserReadMapper implements Mapper<AppUser, UserReadDto>{
    @Override
    public UserReadDto map(AppUser object) {
        return new UserReadDto(
                object.getUsername(),
                object.getEmail(),
                object.getSessions(),
                object.getRegistrationDate(),
                object.getLevel(),
                object.getBalance()
        );
    }
}
