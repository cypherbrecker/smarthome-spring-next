package dev.smarthomebackend.repositories;

import dev.smarthomebackend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    List<User> findByNameContainingIgnoreCase(String name);
}
