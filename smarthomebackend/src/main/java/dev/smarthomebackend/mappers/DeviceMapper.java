package dev.smarthomebackend.mappers;

import dev.smarthomebackend.dto.request.DeviceRequestDTO;
import dev.smarthomebackend.dto.response.DeviceResponseDTO;
import dev.smarthomebackend.dto.response.DeviceTypeResponseDTO;
import dev.smarthomebackend.models.Device;
import dev.smarthomebackend.models.DeviceType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DeviceMapper {

    @Mapping(target = "id", source="deviceType.id")
    @Mapping(target = "typeName", source = "deviceType.typeName")
    DeviceTypeResponseDTO toDTO(DeviceType deviceType);


    //From DeviceRequestDTO to Entity
    @Mapping(target = "deviceType.id", source = "deviceTypeId")
    @Mapping(target = "room.id", source = "roomId")
    Device toEntity(DeviceRequestDTO deviceRequestDTO);



    //From Entity to DeviceResponseDTO
    @Mapping(target = "deviceTypeId", source = "deviceType.id")
    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "datas", source = "datas")
    DeviceResponseDTO toDTO(Device device);


}
