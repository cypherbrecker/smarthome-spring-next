package dev.smarthomebackend.repositories;

import dev.smarthomebackend.models.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findAllByActive(int active);
    void deleteByDeviceId(Long deviceId);

    boolean existsByDeviceId(Long deviceId);
    Optional<Schedule> findByDeviceId(Long deviceId);
}
