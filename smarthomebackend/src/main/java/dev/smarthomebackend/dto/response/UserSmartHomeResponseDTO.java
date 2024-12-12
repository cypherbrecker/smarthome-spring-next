package dev.smarthomebackend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserSmartHomeResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String rank;
    private LocalDateTime lastLogin;
    private Integer rankInt;
    private Integer isLeader;
    private String status;
}
