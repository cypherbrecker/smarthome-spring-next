package dev.smarthomebackend.dto.response;
import dev.smarthomebackend.models.RoomType;
import lombok.Data;

@Data
public class RoomResponseDTO {
    private Long id;
    private String name;
    private Long smartHomeId;
    private RoomType roomType;
}
