package dev.smarthomebackend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "statistics")
public class Statistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "deviceId",nullable = false)
    private Device device;
    private Double temperature;
    private Double humidity;
    private LocalDateTime timestamp;
}
