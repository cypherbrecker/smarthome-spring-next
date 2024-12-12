package dev.smarthomebackend.mappers;

import dev.smarthomebackend.dto.request.RoomRequestDTO;
import dev.smarthomebackend.dto.response.RoomResponseDTO;
import dev.smarthomebackend.dto.response.RoomTypeResponseDTO;
import dev.smarthomebackend.models.Room;
import dev.smarthomebackend.models.RoomType;
import dev.smarthomebackend.models.SmartHome;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoomMapper {

    // Room -> RoomDTO

    @Mapping(target="id", source = "room.id")
    @Mapping(target = "name", source = "room.name")
    @Mapping(target = "smartHomeId", source = "room.smartHome.id")
    @Mapping(target = "roomType", source = "room.roomType")
    RoomResponseDTO toDTO(Room room);

    // RoomRequestDTO -> Room
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "dto.name")
    @Mapping(target = "smartHome", source = "smartHome")
    @Mapping(target = "roomType", source = "roomType")
    Room toEntity(RoomRequestDTO dto, RoomType roomType, SmartHome smartHome);

    // RoomType -> RoomTypeResponseDTO
    @Mapping(target = "id", source = "roomType.id")
    @Mapping(target = "typeName", source = "roomType.typeName")
    RoomTypeResponseDTO toDTO(RoomType roomType);

}
