package dev.smarthomebackend.models;

import dev.smarthomebackend.utils.JsonConverter;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Map;

@Data
@Entity
@Table(name = "device")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @ManyToOne
    @JoinColumn(name = "deviceType")
    private DeviceType deviceType;

    @ManyToOne
    @JoinColumn(name = "romeId")
    private Room room;

    private Integer status;

    @Convert(converter = JsonConverter.class)
    private Map<String, Object> datas;
}
