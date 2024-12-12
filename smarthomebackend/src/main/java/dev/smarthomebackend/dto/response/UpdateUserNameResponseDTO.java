package dev.smarthomebackend.dto.response;

import lombok.Data;

@Data
public class UpdateUserNameResponseDTO {
    private String updatedName;
    private String message;
}
