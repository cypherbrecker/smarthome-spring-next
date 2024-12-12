package dev.smarthomebackend.dto.request;

import lombok.Data;

@Data
public class SignInRequestDTO {
    private String email;
    private String password;
}
