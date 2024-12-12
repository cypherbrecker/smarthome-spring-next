package dev.smarthomebackend.dto.request;


import lombok.Data;
import java.time.LocalTime;

@Data
public class ScheduleRequestDTO {
    private Long deviceId;
    private LocalTime turnOnTime;
    private LocalTime turnOffTime;
    private Integer active;
}
