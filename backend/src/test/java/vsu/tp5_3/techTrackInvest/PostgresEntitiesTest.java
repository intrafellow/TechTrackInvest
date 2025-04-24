package vsu.tp5_3.techTrackInvest;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import vsu.tp5_3.techTrackInvest.entities.enums.Stage;
import vsu.tp5_3.techTrackInvest.entities.postgre.*;
import vsu.tp5_3.techTrackInvest.repositories.postgre.ConferenceRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.SessionRepository;
import vsu.tp5_3.techTrackInvest.repositories.postgre.UserRepository;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class PostgresEntitiesTest {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private ConferenceRepository conferenceRepository;

    private AppUser savedUser;
    private Session savedSession;
    private Conference conference;
    private CrisisHistory crisisHistory;
    private Startup startup;
    private List<Step> steps = new ArrayList<>();
    private List<Expertise> expertiseList = new ArrayList<>();

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        Dotenv dotenv = Dotenv.load();

        registry.add("spring.datasource.url", () -> dotenv.get("DB_URL"));
        registry.add("spring.datasource.username", () -> dotenv.get("DB_USERNAME"));
        registry.add("spring.datasource.password", () -> dotenv.get("DB_PASSWORD"));
    }

    @BeforeEach
    void setUp() {
        // Сохраняем пользователя
        savedUser = new AppUser();
        savedUser.setUsername("admin");
        savedUser.setEmail("leo.chel@mail.ru");
        savedUser.setBalance(BigInteger.valueOf(100));
        savedUser.setLevel(1);
        savedUser.setRegistrationDate(LocalDate.of(2025, 12 ,12));
        savedUser.setPasswordHash("12345");
        userRepository.save(savedUser);

        // Создаём и сохраняем пустую сессию
        savedSession = new Session();
        savedSession.setMonthCount(2);
        savedSession.setStepCount(2);
        savedSession.setStartDate(Timestamp.valueOf("2025-01-01 00:00:00"));
        savedSession.setAppUser(savedUser);
        savedSession.setConferences(new ArrayList<>());
        savedSession.setCrisisHistory(new ArrayList<>());
        savedSession.setStartups(new ArrayList<>());
        savedSession.setSteps(new ArrayList<>());
        sessionRepository.save(savedSession); // Сохраняем отдельно, чтобы Hibernate начал её отслеживать

        // Создаём Step 1
        var step1 = new Step();
        step1.setCash(5000);
        step1.setSequenceNumber(1);
        step1.setReputation(100);
        step1.setSession(savedSession); // Привязываем к уже сохранённой сессии

        var expertise1 = new Expertise();
        expertise1.setValue(15);
        expertise1.setResourceId("IT");
        expertise1.setStep(step1);
        step1.setExpertiseList(List.of(expertise1));

        // Создаём Step 2
        var step2 = new Step();
        step2.setCash(4000);
        step2.setSequenceNumber(2);
        step2.setReputation(100);
        step2.setSession(savedSession);

        var expertise2 = new Expertise();
        expertise2.setValue(20);
        expertise2.setResourceId("IT");
        expertise2.setStep(step2);
        step2.setExpertiseList(List.of(expertise2));

        // Присваиваем шаги сессии
        savedSession.getSteps().add(step1);
        savedSession.getSteps().add(step2);

        // Конференция
        conference = new Conference();
        conference.setTimestamp(2);
        conference.setId("conference-1");
        conference.setSession(savedSession);
        savedSession.getConferences().add(conference);

        // Кризис
        crisisHistory = new CrisisHistory();
        crisisHistory.setCrisisHistoryId("crisis_1");
        crisisHistory.setSession(savedSession);
        savedSession.getCrisisHistory().add(crisisHistory);

        // Стартап
        startup = new Startup();
        startup.setId("startup_1");
        startup.setBudget(1000);
        startup.setExpenses(100);
        startup.setLastMonthRevenue(350);
        startup.setProgress(28);
        startup.setReputation(80);
        startup.setSalePrice(5000);
        startup.setStage(Stage.MVP);
        startup.setTeam(100);
        startup.setSession(savedSession);
        savedSession.getStartups().add(startup);

        // Повторное сохранение всей сессии с вложенными объектами
        sessionRepository.save(savedSession);
    }


    @Test
    public void testRetrieveUserByUsername() {
        AppUser user = userRepository.findByEmail("leo.chel@mail.ru").orElse(null);
        assertNotNull(user);
        assertEquals(user.getUsername(), savedUser.getUsername());
        assertEquals(user.getPasswordHash(), savedUser.getPasswordHash());
    }

    @Test
    public void testCascadeSaveViaSession() {
        assertNotNull(conferenceRepository.findAll());
        assertEquals(conferenceRepository.findAll().size(), 1);
    }

    @Test
    public void testCorrectRelationBetweenSessionAndConference() {
        var conference = conferenceRepository.findById("conference-1").get();
        assertNotNull(conference);
        assertEquals(conference.getId(), "conference-1");
    }

    @Test
    public void testCascadeDelete() {
        assertEquals(1, conferenceRepository.findAll().size());

        sessionRepository.delete(savedSession);

        List<Conference> conf = conferenceRepository.findAll();
        assertTrue(conf.isEmpty());
    }
}
