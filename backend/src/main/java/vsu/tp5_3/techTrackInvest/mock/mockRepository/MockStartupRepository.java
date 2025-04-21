package vsu.tp5_3.techTrackInvest.mock.mockRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.dto.ExpertiseReadDto;
import vsu.tp5_3.techTrackInvest.dto.StartupShortReadDto;
import vsu.tp5_3.techTrackInvest.filters.CategoryFilter;
import vsu.tp5_3.techTrackInvest.mock.mockEntities.MockStartup;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MockStartupRepository {
    List<MockStartup> startups = List.of(
            new MockStartup("1", 1, "NeuroLink", "Neural interface technology", new BigDecimal("2500000.00"), 5),
            new MockStartup("2", 2, "EcoBattery", "Biodegradable batteries", new BigDecimal("150000.00"), 4),
            new MockStartup("3", 3, "GenomeX", "Personalized medicine solutions", new BigDecimal("1800000.00"), 5),
            new MockStartup("4", 4, "OrbitClean", "Space debris removal", new BigDecimal("3200000.00"), 3),
            new MockStartup("5", 1, "QuantumSoft", "Quantum computing software", new BigDecimal("1750000.00"), 4),
            new MockStartup("6", 2, "SolarDroid", "Autonomous solar panel cleaners", new BigDecimal("890000.00"), 4),
            new MockStartup("7", 3, "BioPrint", "3D bioprinting organs", new BigDecimal("2100000.00"), 5),
            new MockStartup("8", 4, "LunarHab", "Modular lunar habitats", new BigDecimal("4500000.00"), 2),
            new MockStartup("9", 1, "CryptoShield", "Blockchain security solutions", new BigDecimal("950000.00"), 3),
            new MockStartup("10", 2, "AquaPure", "AI-powered water purification", new BigDecimal("1200000.00"), 4)
    );

    public Optional<MockStartup> findById(String id) {
        return startups.stream().filter(a -> a.getId().equals(id)).findFirst();
    }

    public List<MockStartup> findPurchased(CategoryFilter categoryFilter) {
        return startups.stream()
                .filter(a -> a.getCategoryId().equals(categoryFilter.id())).toList();
        /** Так как тягается из разных мест, нужно придумать как этот метод будет выглядеть в репозитории */

    }

    public List<MockStartup> findAvailable(CategoryFilter categoryFilter) {
        return startups.stream()
                .filter(a -> a.getCategoryId().equals(categoryFilter.id())).toList();
        /** Так как тягается из разных мест, нужно придумать как этот метод будет выглядеть в репозитории */
    }
}
