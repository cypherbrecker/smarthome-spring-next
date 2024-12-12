package dev.smarthomebackend.controllers;


import dev.smarthomebackend.dto.request.PasswordChangeRequestDTO;
import dev.smarthomebackend.dto.request.UpdateUserNameRequestDTO;
import dev.smarthomebackend.dto.response.PasswordChangeResponseDTO;
import dev.smarthomebackend.dto.response.UpdateUserNameResponseDTO;
import dev.smarthomebackend.dto.response.UserResponseDTO;
import dev.smarthomebackend.models.HomeAttach;
import dev.smarthomebackend.models.User;
import dev.smarthomebackend.repositories.HomeAttachRepository;
import dev.smarthomebackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/get-logged-in-profile-info")
    public ResponseEntity<UserResponseDTO> getLoggedInUserProfile() throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserResponseDTO userResponseDTO  = userService.getMyInfo(email);
        return ResponseEntity.ok(userResponseDTO);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponseDTO>> searchUsersByName(@RequestParam("name") String name) {
        List<UserResponseDTO> users = userService.searchUsersByName(name);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/update-name")
    public ResponseEntity<UpdateUserNameResponseDTO> updateUserName(
            @RequestBody UpdateUserNameRequestDTO updateUserNameRequestDTO) throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UpdateUserNameResponseDTO responseDTO = userService.updateUserName(email, updateUserNameRequestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/change-pwd")
    public ResponseEntity<PasswordChangeResponseDTO> changePassword(@RequestBody PasswordChangeRequestDTO passwordChangeRequestDTO) {
        try {
            PasswordChangeResponseDTO response = userService.changePassword(passwordChangeRequestDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            PasswordChangeResponseDTO errorResponse = new PasswordChangeResponseDTO();
            errorResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

}
