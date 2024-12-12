package dev.smarthomebackend.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name="smartHomeId")
    private SmartHome smartHome;

    @ManyToOne
    @JoinColumn(name = "roomType")
    private RoomType roomType;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
