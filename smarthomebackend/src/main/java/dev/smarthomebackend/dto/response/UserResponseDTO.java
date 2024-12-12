package dev.smarthomebackend.dto.response;

import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String email;
    private String name;
    private Integer isLeader;
}
