package dev.smarthomebackend.controllers;

import dev.smarthomebackend.dto.response.UserResponseDTO;
import dev.smarthomebackend.services.HomeAttachService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/homeattach")
public class HomeAttachController {

    private final HomeAttachService homeAttachService;

    @PostMapping("/add-user")
    public ResponseEntity<String> addUserToSmartHome(@RequestParam("userId") Long userId, @RequestParam("smartHomeId") Long smartHomeId) {
        homeAttachService.addUserToSmartHome(userId, smartHomeId);
        return ResponseEntity.ok("User added to smart home");
    }

    @DeleteMapping("/remove-user")
    public ResponseEntity<String> removeUserFromSmartHome(@RequestParam("userId") Long userId, @RequestParam("smartHomeId") Long smartHomeId) {
        homeAttachService.removeUserFromSmartHome(userId, smartHomeId);
        return ResponseEntity.ok("User removed from smart home");
    }

    @PostMapping("/assignRank")
    public ResponseEntity<?> assignRankToUser(@RequestParam Long userId, @RequestParam Long smartHomeId, @RequestParam Integer rank) {
        homeAttachService.assignRankToUser(userId, smartHomeId, rank);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check-leader")
    public ResponseEntity<UserResponseDTO> checkUserLeader() {
        // get logged user's email
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        try {
            // checking the logged user isLeader or no in the selected home
            UserResponseDTO userResponseDTO = homeAttachService.isUserLeaderInSelectedSmartHome(email);
            return ResponseEntity.ok(userResponseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/user/rank")
    public ResponseEntity<Integer> getUserRank(@AuthenticationPrincipal UserDetails userDetails) {
        Integer rank = homeAttachService.getUserRank(userDetails.getUsername());
        return ResponseEntity.ok(rank);
    }
}
