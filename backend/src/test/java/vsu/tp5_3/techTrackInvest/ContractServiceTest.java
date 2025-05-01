package vsu.tp5_3.techTrackInvest;


import org.junit.jupiter.api.Test;
import vsu.tp5_3.techTrackInvest.service.implementations.ContractService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ContractServiceTest {
    @Test
    void testGetFinalContractPrice_MinRoll() {
        ContractService service = new ContractService(null, null, null, null);

        int price = service.getFinalContractPrice(1, 1000, 2000);
        assertEquals(2000, price);
    }

    @Test
    void testGetFinalContractPrice_MaxRoll() {
        ContractService service = new ContractService(null, null, null, null);

        int price = service.getFinalContractPrice(20, 1000, 2000);
        assertEquals(1000, price);
    }

    @Test
    void testGetFinalContractPrice_MidRoll() {
        ContractService service = new ContractService(null, null, null, null);

        int price = service.getFinalContractPrice(10, 1000, 2000);
        assertEquals(1526, price); // Примерное значение
    }

    @Test
    void testGetFinalContractPrice_OffBounds() {
        ContractService service = new ContractService(null, null, null, null);

        // Проверка что rollResult вне допустимых границ работает "мягко"
        int price = service.getFinalContractPrice(0, 1000, 2000);
        assertTrue(price >= 2000);

        price = service.getFinalContractPrice(21, 1000, 2000);
        assertTrue(price <= 1000);
    }
}
