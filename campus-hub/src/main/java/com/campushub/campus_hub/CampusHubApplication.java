package com.campushub.campus_hub;

import com.campushub.campus_hub.Dao.StudentDao;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.campushub.campus_hub.Dao")
@EntityScan(basePackages = "com.campushub.campus_hub.Entity")
public class CampusHubApplication {

	public static void main(String[] args) {

		SpringApplication.run(CampusHubApplication.class, args);
	}

}
