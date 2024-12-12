package dev.smarthomebackend.dto.request;

import lombok.Data;

@Data
public class PasswordChangeRequestDTO {
    private String oldPassword;
    private String newPassword;
}
