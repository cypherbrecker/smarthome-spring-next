package dev.smarthomebackend.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "deviceType")
public class DeviceType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String typeName;
}
