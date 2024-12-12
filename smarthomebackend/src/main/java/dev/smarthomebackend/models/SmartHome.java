package dev.smarthomebackend.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "smart_homes")
public class SmartHome {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    private String rank_1;
    private String rank_2;
    private String rank_3;
}
