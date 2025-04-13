package vsu.tp5_3.techTrackInvest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vsu.tp5_3.techTrackInvest.entities.AppUser;

@Repository
public interface UserRepository extends JpaRepository<AppUser, Long> {
}
