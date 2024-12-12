package dev.smarthomebackend.mappers;

import dev.smarthomebackend.dto.response.SmartHomeNameResponseDTO;
import dev.smarthomebackend.models.SmartHome;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SmartHomeMapper {

    @Mapping(target="id", source = "id")
    @Mapping(target="name", source="name")
    SmartHomeNameResponseDTO smartHomeToSmartHomeNameDTO(SmartHome smartHome);
}
