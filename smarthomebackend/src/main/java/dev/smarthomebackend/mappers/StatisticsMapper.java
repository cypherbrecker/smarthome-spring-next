package dev.smarthomebackend.mappers;

import dev.smarthomebackend.dto.request.StatisticsRequestDTO;
import dev.smarthomebackend.dto.response.StatisticsResponseDTO;
import dev.smarthomebackend.models.Statistics;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StatisticsMapper {

    @Mapping(target = "device.id", source = "deviceId")
    Statistics toEntity(StatisticsRequestDTO statisticsRequestDTO);

    @Mapping(target = "deviceId", source = "device.id")
    StatisticsResponseDTO toDTO(Statistics statistics);
}
