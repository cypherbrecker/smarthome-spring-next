package dev.smarthomebackend.dto.request;


import lombok.Data;
import java.util.Map;

@Data
public class DeviceDataUpdateRequestDTO {
    private Long deviceId;
    private Map<String, Object> updatedData;
}
