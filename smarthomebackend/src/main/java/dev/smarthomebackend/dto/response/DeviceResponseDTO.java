package dev.smarthomebackend.dto.response;

import lombok.Data;

@Data
public class DeviceResponseDTO {
    private Long id;
    private String name;
    private Long deviceTypeId;
    private Long roomId;
    private Integer status;
    private Object datas;
}
