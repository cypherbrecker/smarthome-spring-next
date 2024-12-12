package dev.smarthomebackend.repositories;

import dev.smarthomebackend.models.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface StatisticsRepository extends JpaRepository<Statistics, Long> {
    List<Statistics> findByDeviceIdOrderByTimestampDesc(Long deviceId);
    @Query("SELECT AVG(s.temperature) FROM Statistics s " +
            "WHERE s.device.id = :deviceId AND DATE(s.timestamp) = :targetDate")
    Double calculateAverageTemperature(@Param("deviceId") Long deviceId, @Param("targetDate") LocalDate targetDate);
}
