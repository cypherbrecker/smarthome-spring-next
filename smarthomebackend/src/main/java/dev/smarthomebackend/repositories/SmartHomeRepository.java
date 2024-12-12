package dev.smarthomebackend.repositories;

import dev.smarthomebackend.models.SmartHome;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SmartHomeRepository extends JpaRepository<SmartHome, Long> {
}
