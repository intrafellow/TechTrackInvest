package vsu.tp5_3.techTrackInvest;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;

import java.math.BigInteger;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PostgresEntitiesTest {
    @Autowired
    private UserRepository userRepository;

    private AppUser savedUser;

    @BeforeEach
    void setUp() {
        savedUser = new AppUser();
        savedUser.setUsername("admin");
        savedUser.setEmail("leo.chel@mail.ru");
        savedUser.setBalance(BigInteger.valueOf(100));
        savedUser.setLevel(1);
        savedUser.setRegistrationDate(LocalDate.of(2025, 12 ,12));
        savedUser.setPasswordHash("12345");
        userRepository.save(savedUser);
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }

    @Test
    public void testRetrieveUserByUsername() {
        AppUser user = userRepository.findByEmail("leo.chel@mail.ru").orElse(null);
        assertNotNull(user);
        assertEquals(user.getUsername(), savedUser.getUsername());
        assertEquals(user.getPasswordHash(), savedUser.getPasswordHash());
    }
}
