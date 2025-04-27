package vsu.tp5_3.techTrackInvest.repositories.postgre;

import org.springframework.data.jpa.repository.JpaRepository;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;

import java.util.List;

public interface CurrentDisplayedStartupRepository extends JpaRepository<CurrentDisplayedStartup, Long> {
    List<CurrentDisplayedStartup> findAllByNicheId(String nicheId);
}
