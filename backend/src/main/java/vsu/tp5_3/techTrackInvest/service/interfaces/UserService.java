package vsu.tp5_3.techTrackInvest.service.interfaces;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import vsu.tp5_3.techTrackInvest.dto.ExpertiseDto;
import vsu.tp5_3.techTrackInvest.dto.MoneyDto;
import vsu.tp5_3.techTrackInvest.dto.ReputationDto;

import java.util.Optional;

public interface UserService extends UserDetailsService {
    UserDetails loadUserByUsername(String username);
    Optional<MoneyDto> getMoney();
    Optional<ReputationDto> getReputation();
    Optional<ExpertiseDto> getExpertise();
    boolean updatePassword(String email, String newPassword);
}
