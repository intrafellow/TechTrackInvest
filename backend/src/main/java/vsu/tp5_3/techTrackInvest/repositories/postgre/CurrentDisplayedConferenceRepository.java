package vsu.tp5_3.techTrackInvest.repositories.postgre;

import org.springframework.data.jpa.repository.JpaRepository;
import vsu.tp5_3.techTrackInvest.entities.postgre.CurrentDisplayedConference;

public interface CurrentDisplayedConferenceRepository extends JpaRepository<CurrentDisplayedConference, Long> {
}
