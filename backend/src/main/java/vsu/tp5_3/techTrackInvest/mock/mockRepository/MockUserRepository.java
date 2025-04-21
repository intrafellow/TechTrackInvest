package vsu.tp5_3.techTrackInvest.mock.mockRepository;

import org.springframework.stereotype.Repository;
import vsu.tp5_3.techTrackInvest.dto.RegistrationDto;
import vsu.tp5_3.techTrackInvest.entities.postgre.AppUser;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
@Repository
public class MockUserRepository {
    private final List<AppUser> users;
    public MockUserRepository() {
        users = generateTestUsers();
    }
    private List<AppUser> generateTestUsers() {
        List<AppUser> users = new ArrayList<>();

        for (int i = 1; i <= 10; i++) {
            AppUser user = new AppUser();
            user.setUsername("user" + i);
            user.setEmail("user" + i + "@e.e");
            user.setPasswordHash("$2a$10$aeKPcqrXL/FREfxhg40d0e9gyBUvSvGbvEVZ.sWbTToT6dnZ3qLGm");
            user.setRegistrationDate(LocalDate.of(1111, 1, 1));
            user.setLevel(ThreadLocalRandom.current().nextInt(1, 100));
            user.setBalance(BigInteger.valueOf(ThreadLocalRandom.current().nextLong(1000, 100000)));
            user.setSessions(new ArrayList<>());

            users.add(user);
        }

        return users;
    }

    public Optional<AppUser> findByEmail(String email) {
        return users.stream().filter(a -> a.getEmail().equals(email)).findFirst();
    }

    public boolean save(RegistrationDto registrationDto) {
        AppUser user = new AppUser();
        user.setEmail(registrationDto.getEmail());
        user.setPasswordHash(registrationDto.getPassword());
        user.setUsername(registrationDto.getUsername());
        users.add(user);
        return true;
    }
}
