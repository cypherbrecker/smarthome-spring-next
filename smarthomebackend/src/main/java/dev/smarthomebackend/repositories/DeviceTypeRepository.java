package dev.smarthomebackend.repositories;

import dev.smarthomebackend.models.DeviceType;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DeviceTypeRepository extends JpaRepository<DeviceType, Long> {

}
