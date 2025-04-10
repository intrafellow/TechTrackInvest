package vsu.tp5_3.techTrackInvest.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vsu.tp5_3.techTrackInvest.entities.AppUser;

public interface UserRepository extends JpaRepository<AppUser, Long> {
}
