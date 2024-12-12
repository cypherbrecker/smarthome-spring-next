package dev.smarthomebackend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "schedule")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "deviceId")
    private Device device;

    private LocalTime turnOnTime;
    private LocalTime turnOffTime;
    private Integer active;
}
