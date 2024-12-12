package dev.smarthomebackend.dto.request;
import lombok.Data;

@Data
public class RoomRequestDTO {
    private String name;
    private Long smartHomeId;
    private Long roomTypeId;
}
