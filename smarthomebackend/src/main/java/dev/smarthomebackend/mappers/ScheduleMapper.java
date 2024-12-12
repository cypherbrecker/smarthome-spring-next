package dev.smarthomebackend.mappers;

import dev.smarthomebackend.dto.request.ScheduleRequestDTO;
import dev.smarthomebackend.dto.response.ScheduleResponseDTO;
import dev.smarthomebackend.models.Schedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {

    @Mapping(target = "device.id", source = "deviceId")
    Schedule toEntity(ScheduleRequestDTO scheduleRequestDTO);

    @Mapping(target = "deviceId", source = "device.id")
    ScheduleResponseDTO toDTO(Schedule schedule);

}
