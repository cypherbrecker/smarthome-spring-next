package dev.smarthomebackend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StatisticsResponseDTO {
    private Long deviceId;
    private Double temperature;
    private Double humidity;
    private LocalDateTime timestamp;
}
