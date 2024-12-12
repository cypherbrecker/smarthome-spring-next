package dev.smarthomebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmarthomebackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmarthomebackendApplication.class, args);
	}

}
