package vsu.tp5_3.techTrackInvest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class TechTrackInvestApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();

		setPropertyIfExists(dotenv, "DB_URL");
		setPropertyIfExists(dotenv, "DB_USERNAME");
		setPropertyIfExists(dotenv, "DB_PASSWORD");

		SpringApplication.run(TechTrackInvestApplication.class, args);
	}

	private static void setPropertyIfExists(Dotenv dotenv, String key) {
		String value = dotenv.get(key);
		if (value != null) {
			System.setProperty(key, value);
		}
	}

}
