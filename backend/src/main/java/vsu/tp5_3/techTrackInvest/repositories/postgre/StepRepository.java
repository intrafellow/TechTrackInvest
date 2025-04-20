package vsu.tp5_3.techTrackInvest.repositories.postgre;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vsu.tp5_3.techTrackInvest.entities.postgre.Step;

@Repository
public interface StepRepository extends JpaRepository<Step, Long> {
}
