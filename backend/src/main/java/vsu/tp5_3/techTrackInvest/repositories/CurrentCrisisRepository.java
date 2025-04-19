package vsu.tp5_3.techTrackInvest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentCrisis;

@Repository
public interface CurrentCrisisRepository extends JpaRepository<CurrentCrisis, String> {
}
