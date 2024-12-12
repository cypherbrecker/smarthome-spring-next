package dev.smarthomebackend.dto.response;


import lombok.Data;

import java.time.LocalTime;

@Data
public class ScheduleResponseDTO {
    private Long id;
    private Long deviceId;
    private LocalTime turnOnTime;
    private LocalTime turnOffTime;
    private Integer active;
}
