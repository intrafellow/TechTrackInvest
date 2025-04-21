package vsu.tp5_3.techTrackInvest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class TechTrackInvestApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
		System.setProperty("DB_URL", dotenv.get("DB_URL"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		System.setProperty("MONGO_URI", dotenv.get("MONGO_URI"));

		SpringApplication.run(TechTrackInvestApplication.class, args);
	}

	private static void setPropertyIfExists(Dotenv dotenv, String key) {
		String value = dotenv.get(key);
		if (value != null) {
			System.setProperty(key, value);
		}
	}

}
