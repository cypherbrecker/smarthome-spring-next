package dev.smarthomebackend.models;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "roomType")
public class RoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String typeName;
}
