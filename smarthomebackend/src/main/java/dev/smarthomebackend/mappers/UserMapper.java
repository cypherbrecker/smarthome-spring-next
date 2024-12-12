package dev.smarthomebackend.mappers;

import dev.smarthomebackend.dto.request.UpdateUserNameRequestDTO;
import dev.smarthomebackend.dto.response.PasswordChangeResponseDTO;
import dev.smarthomebackend.dto.response.UpdateUserNameResponseDTO;
import dev.smarthomebackend.dto.response.UserResponseDTO;
import dev.smarthomebackend.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "name", source = "name")
    UserResponseDTO userToUserResponseDTO(User user);

    List<UserResponseDTO> usersToUserResponseDTOs(List<User> users);

    @Mapping(target="name", source ="name")
    void updateUserNameFromDTO(UpdateUserNameRequestDTO dto, @MappingTarget User user);

    UpdateUserNameResponseDTO toUpdateUserNameResponseDTO(User user);

    @Mapping(target = "message", source = "message")
    PasswordChangeResponseDTO toPasswordChangeResponseDTO(String message);
}
