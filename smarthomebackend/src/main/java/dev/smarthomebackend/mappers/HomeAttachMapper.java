package dev.smarthomebackend.mappers;

import dev.smarthomebackend.dto.response.UserResponseDTO;
import dev.smarthomebackend.dto.response.UserSmartHomeResponseDTO;
import dev.smarthomebackend.models.HomeAttach;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HomeAttachMapper {


    @Mapping(target = "id", source = "user.id")
    @Mapping(target = "name", source = "user.name")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "rank", source = "rank")
    @Mapping(target = "lastLogin", source = "user.lastLogin")
    @Mapping(target = "isLeader", source = "isLeader")
    @Mapping(target = "status", expression = "java(homeAttach.getUser().getIsOnline() != null ? (homeAttach.getUser().getIsOnline() == 1 ? \"Online\" : \"Offline\") : \"Unknown\")")
    UserSmartHomeResponseDTO homeAttachToUserSmartHomeDTO(HomeAttach homeAttach);

    @Mapping(target = "id", source = "user.id")
    @Mapping(target = "name", source = "user.name")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "isLeader", source = "isLeader") //
    UserResponseDTO homeAttachToUserResponseDTO(HomeAttach homeAttach);

    default String getStatus(Integer isOnline) {
        if (isOnline == null) {
            return "Unknown";
        }
        return isOnline == 1 ? "Online" : "Offline";
    }
}
