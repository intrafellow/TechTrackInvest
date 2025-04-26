package vsu.tp5_3.techTrackInvest.service.implementations;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vsu.tp5_3.techTrackInvest.entities.mongo.NicheMongo;
import vsu.tp5_3.techTrackInvest.repositories.mongo.NicheMongoRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class NicheService {
    private final NicheMongoRepository nicheMongoRepository;

    private Map<String, String> idToNameNicheMap;

    public String getNicheName(String nicheId) {
        if (idToNameNicheMap == null) {
            preloadCache();
        }

        return idToNameNicheMap.get(nicheId);
    }

    @PostConstruct
    public void preloadCache() {
        if (idToNameNicheMap != null) {
            return;
        }

        idToNameNicheMap = nicheMongoRepository.findAll().stream()
                .collect(Collectors.toMap(NicheMongo::getId, NicheMongo::getName));
    }
}
