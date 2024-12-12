package dev.smarthomebackend.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "home_attach")
public class HomeAttach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "smart_home_id")
    private SmartHome smartHome;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Integer rank;
    private Integer isLeader;
}
