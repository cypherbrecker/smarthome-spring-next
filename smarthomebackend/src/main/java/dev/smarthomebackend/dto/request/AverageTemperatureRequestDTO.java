package dev.smarthomebackend.dto.request;

import lombok.Data;

@Data
public class AverageTemperatureRequestDTO {
    private Long deviceId;
    private String date;
}
