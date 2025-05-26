package vsu.tp5_3.techTrackInvest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import vsu.tp5_3.techTrackInvest.entities.mongo.Contract;
import vsu.tp5_3.techTrackInvest.entities.mongo.StartupMongo;
import vsu.tp5_3.techTrackInvest.service.implementations.contractGenerator.ContractGeneratorImpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

public class StartupGeneratorTest {
    @Mock
    private StartupMongo startupMongo;

    private ContractGeneratorImpl contractGenerator;

    @BeforeEach
    void setUp() {
        // Инициализация моков
        MockitoAnnotations.openMocks(this);
        contractGenerator = new ContractGeneratorImpl();
    }

    @Test
    void testGenerateContract_SetsCorrectStartupId() {
        // Arrange
        String startupId = "test-id";
        when(startupMongo.getId()).thenReturn(startupId);
        when(startupMongo.getPrice()).thenReturn(1000);

        // Act
        Contract contract = contractGenerator.generateContract(startupMongo);

        // Assert
        assertEquals(startupId, contract.getStartupId(), "Startup ID should match");
    }

    @Test
    void testGenerateContract_CalculatesMinPriceCorrectly() {
        // Arrange
        int price = 1000;
        when(startupMongo.getId()).thenReturn("test-id");
        when(startupMongo.getPrice()).thenReturn(price);

        // Act
        Contract contract = contractGenerator.generateContract(startupMongo);

        // Assert
        int expectedMinPrice = (int) (price * 0.8); // 80% от 1000 = 800
        assertEquals(expectedMinPrice, contract.getMinPrice(), "Min price should be 80% of startup price");
    }

    @Test
    void testGenerateContract_CalculatesMaxPriceCorrectly() {
        // Arrange
        int price = 1000;
        when(startupMongo.getId()).thenReturn("test-id");
        when(startupMongo.getPrice()).thenReturn(price);

        // Act
        Contract contract = contractGenerator.generateContract(startupMongo);

        // Assert
        int expectedMaxPrice = (int) (price * 1.2); // 120% от 1000 = 1200
        assertEquals(expectedMaxPrice, contract.getMaxPrice(), "Max price should be 120% of startup price");
    }

    @Test
    void testGenerateContract_TeamEffectInRange() {
        // Arrange
        when(startupMongo.getId()).thenReturn("test-id");
        when(startupMongo.getPrice()).thenReturn(1000);

        // Act
        Contract contract = contractGenerator.generateContract(startupMongo);

        // Assert
        assertTrue(contract.getTeamEffect() >= 0 && contract.getTeamEffect() <= 10,
                "Team effect should be between 0 and 10");
    }

    @Test
    void testGenerateContract_ReputationEffectInRange() {
        // Arrange
        when(startupMongo.getId()).thenReturn("test-id");
        when(startupMongo.getPrice()).thenReturn(1000);

        // Act
        Contract contract = contractGenerator.generateContract(startupMongo);

        // Assert
        assertTrue(contract.getReputationEffect() >= 0 && contract.getReputationEffect() <= 10,
                "Reputation effect should be between 0 and 10");
    }

    @Test
    void testGenerateContract_NegativePrice_EnsuresMinPriceNonNegative() {
        // Arrange
        int negativePrice = -1000;
        when(startupMongo.getId()).thenReturn("test-id");
        when(startupMongo.getPrice()).thenReturn(negativePrice);

        // Act
        Contract contract = contractGenerator.generateContract(startupMongo);

        // Assert
        assertEquals(0, contract.getMinPrice(), "Min price should be 0 if calculated price is negative");
        assertEquals((int) (negativePrice * 1.2), contract.getMaxPrice(), "Max price should be calculated correctly");
    }

    @Test
    void testGenerateContract_ZeroPrice() {
        // Arrange
        when(startupMongo.getId()).thenReturn("test-id");
        when(startupMongo.getPrice()).thenReturn(0);

        // Act
        Contract contract = contractGenerator.generateContract(startupMongo);

        // Assert
        assertEquals(0, contract.getMinPrice(), "Min price should be 0 for zero startup price");
        assertEquals(0, contract.getMaxPrice(), "Max price should be 0 for zero startup price");
    }
}
