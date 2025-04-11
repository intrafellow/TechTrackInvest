package vsu.tp5_3.techTrackInvest;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class TechTrackInvestApplicationTests {

	@Test
	@Tag("test for test")
	void testingMethod() {
		Assertions.assertTrue(true);
	}
}
