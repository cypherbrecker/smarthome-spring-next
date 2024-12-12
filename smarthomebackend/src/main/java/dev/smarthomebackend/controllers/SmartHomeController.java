package dev.smarthomebackend.controllers;

import dev.smarthomebackend.dto.response.SmartHomeNameResponseDTO;
import dev.smarthomebackend.dto.response.UserSmartHomeResponseDTO;
import dev.smarthomebackend.models.SmartHome;
import dev.smarthomebackend.services.SmartHomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/smarthomes")
public class SmartHomeController {

    private final SmartHomeService smartHomeService;

    //for the logged user it returns all smarthome where he is member
    @GetMapping("/user/homes")
    public ResponseEntity<List<SmartHome>> getSmartHomeByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        List<SmartHome> smartHomes = smartHomeService.getSmartHomeByUser(userEmail);

        return ResponseEntity.ok(smartHomes);
    }


    @PostMapping("/set-selected")
    public ResponseEntity<Void> setSelectedSmartHome(@RequestBody Long homeId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        smartHomeService.setSelectedSmartHome(userEmail, homeId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/get-selected-home")
    public ResponseEntity<SmartHomeNameResponseDTO> getSelectedSmartHome() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        SmartHomeNameResponseDTO selectedHomeDTO = smartHomeService.getSelectedSmartHome(userEmail);

        return ResponseEntity.ok(selectedHomeDTO);
    }


    //return a list about users in a home
    @GetMapping("/selected-home/users")
    public ResponseEntity<List<UserSmartHomeResponseDTO>> getUsersBySelectedSmartHome() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        List<UserSmartHomeResponseDTO> users = smartHomeService.getUsersBySmartHome(userEmail);
        return ResponseEntity.ok(users);
    }
}
