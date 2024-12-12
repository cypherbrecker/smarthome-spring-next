package dev.smarthomebackend.repositories;

import dev.smarthomebackend.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findBySmartHomeId(Long smartHomeId);
}
