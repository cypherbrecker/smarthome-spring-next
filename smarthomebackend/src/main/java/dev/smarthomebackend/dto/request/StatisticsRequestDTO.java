package dev.smarthomebackend.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StatisticsRequestDTO {
    private Long deviceId;
    private Double temperature;
    private Double humidity;
    private LocalDateTime timestamp;
}
