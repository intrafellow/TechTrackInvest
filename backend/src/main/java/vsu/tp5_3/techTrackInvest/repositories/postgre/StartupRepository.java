package vsu.tp5_3.techTrackInvest.repositories.postgre;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vsu.tp5_3.techTrackInvest.entities.postgre.Startup;

import java.util.List;

@Repository
public interface StartupRepository extends JpaRepository<Startup, String> {
    List<Startup> findAllByNicheId(String nicheId);
}
