package vsu.tp5_3.techTrackInvest.configs;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().servers(
                List.of(new Server().url("https://techtrackinvest.ru"))
        ).info(new Info().title("Tech track invest game").version("0.0.1"));
    }
}
