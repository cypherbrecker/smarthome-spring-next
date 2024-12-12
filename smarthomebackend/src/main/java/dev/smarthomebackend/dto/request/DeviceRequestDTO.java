package dev.smarthomebackend.dto.request;


import lombok.Data;

@Data
public class DeviceRequestDTO {
    private String name;
    private Long deviceTypeId;
    private Long roomId;
    private Integer status;
}
