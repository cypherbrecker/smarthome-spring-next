package dev.smarthomebackend.controllers;

import dev.smarthomebackend.dto.request.RoomRequestDTO;
import dev.smarthomebackend.dto.response.RoomResponseDTO;
import dev.smarthomebackend.dto.response.RoomTypeResponseDTO;
import dev.smarthomebackend.mappers.RoomMapper;
import dev.smarthomebackend.models.Room;
import dev.smarthomebackend.services.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;
    private final RoomMapper roomMapper;

    // get room types
    @GetMapping("/types")
    public ResponseEntity<List<RoomTypeResponseDTO>> getAllRoomTypes() {
        List<RoomTypeResponseDTO> roomTypes = roomService.getAllRoomTypes()
                .stream()
                .map(roomMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(roomTypes);
    }


    @PostMapping("/create")
    public ResponseEntity<RoomResponseDTO> createRoom(@RequestBody RoomRequestDTO roomRequestDTO) {
       RoomResponseDTO room = roomService.createRoom(roomRequestDTO);
        return ResponseEntity.ok(room);
    }

    @PostMapping("/smarthome/rooms")
    public ResponseEntity<List<RoomResponseDTO>> getRoomsBySmartHomeId(@RequestBody Long smartHomeId) {
        List<RoomResponseDTO> rooms = roomService.getRoomsBySmartHomeId(smartHomeId)
                .stream()
                .map(roomMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rooms);
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        Room updatedRoom = roomService.updateRoom(id, room);
        return ResponseEntity.ok(updatedRoom);
    }
}
