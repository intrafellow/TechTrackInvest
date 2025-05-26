package vsu.tp5_3.techTrackInvest.repositories.postgre;

import org.springframework.data.jpa.repository.JpaRepository;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedStartup;

import java.util.List;
import java.util.Optional;

public interface CurrentDisplayedStartupRepository extends JpaRepository<CurrentDisplayedStartup, Long> {
    List<CurrentDisplayedStartup> findAllByNicheId(String nicheId);
    List<CurrentDisplayedStartup> findAllByResourceId(String resourceId);
}
