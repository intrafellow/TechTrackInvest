package vsu.tp5_3.techTrackInvest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vsu.tp5_3.techTrackInvest.entities.Conference;

@Repository
public interface ConferenceRepository extends JpaRepository<Conference, String> {
}
