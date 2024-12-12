package dev.smarthomebackend.controllers;

import dev.smarthomebackend.dto.request.SignInRequestDTO;
import dev.smarthomebackend.dto.request.SignOutRequestDTO;
import dev.smarthomebackend.dto.response.JWTResponseDTO;
import dev.smarthomebackend.models.User;
import dev.smarthomebackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthorizationController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<JWTResponseDTO> register(@RequestBody User user) {
        JWTResponseDTO response = userService.register(user);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<JWTResponseDTO> login(@RequestBody SignInRequestDTO loginRequest) {
        JWTResponseDTO response = userService.login(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestBody SignOutRequestDTO signOutRequestDTO) {

        String email = signOutRequestDTO.getEmail();

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        userService.logout(email);
        return ResponseEntity.ok("User logged out successfully.");
    }
}
