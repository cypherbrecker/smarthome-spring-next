package dev.smarthomebackend.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class JWTResponseDTO {
    private int statusCode;
    private String message;
    private String token;
    private String role;
    private String expirationTime;
    private UserResponseDTO user;
    private List<UserResponseDTO> userList;
    private String email;
}
