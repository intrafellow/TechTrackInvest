package vsu.tp5_3.techTrackInvest.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.UserProfileDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;
@Component
@RequiredArgsConstructor
public class UserProfileMapper implements Mapper<AppUser, UserProfileDto>{
    @Override
    public UserProfileDto map(AppUser object) {
        return new UserProfileDto(
                object.getEmail(),
                object.getUsername()
        );
    }
}
