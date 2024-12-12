package dev.smarthomebackend.repositories;

import dev.smarthomebackend.models.HomeAttach;
import dev.smarthomebackend.models.SmartHome;
import dev.smarthomebackend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface HomeAttachRepository extends JpaRepository<HomeAttach, Long> {

    List<HomeAttach> findByUser(User user);
    List<HomeAttach> findBySmartHome(SmartHome smartHome);


    boolean existsByUserIdAndSmartHomeId(Long userId, Long smartHomeId);

    Optional<HomeAttach> findByUserIdAndSmartHomeId(Long userId, Long smartHomeId);




}
