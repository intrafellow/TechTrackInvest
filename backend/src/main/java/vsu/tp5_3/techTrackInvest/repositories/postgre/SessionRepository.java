package vsu.tp5_3.techTrackInvest.repositories.postgre;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;
import vsu.tp5_3.techTrackInvest.entities.postgre.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    void deleteByAppUser(AppUser user);
}
