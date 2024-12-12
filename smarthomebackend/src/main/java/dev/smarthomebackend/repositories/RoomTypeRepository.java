package dev.smarthomebackend.repositories;

import dev.smarthomebackend.models.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
}
