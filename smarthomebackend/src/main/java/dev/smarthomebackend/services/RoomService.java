package dev.smarthomebackend.services;

import dev.smarthomebackend.dto.request.RoomRequestDTO;
import dev.smarthomebackend.dto.response.RoomResponseDTO;
import dev.smarthomebackend.exceptions.NotFoundException;
import dev.smarthomebackend.mappers.RoomMapper;
import dev.smarthomebackend.models.Room;
import dev.smarthomebackend.models.RoomType;
import dev.smarthomebackend.models.SmartHome;
import dev.smarthomebackend.repositories.RoomRepository;
import dev.smarthomebackend.repositories.RoomTypeRepository;
import dev.smarthomebackend.repositories.SmartHomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final SmartHomeRepository smartHomeRepository;
    private final RoomMapper roomMapper;

    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }

    public RoomResponseDTO createRoom(RoomRequestDTO roomRequestDTO) {
        Optional<SmartHome> smartHome = smartHomeRepository.findById(roomRequestDTO.getSmartHomeId());
        Optional<RoomType> roomType = roomTypeRepository.findById(roomRequestDTO.getRoomTypeId());

        if (smartHome.isPresent() && roomType.isPresent()) {
            Room room = roomMapper.toEntity(roomRequestDTO, roomType.get(), smartHome.get());
            Room savedRoom = roomRepository.save(room);
            return roomMapper.toDTO(savedRoom);

        } else {
            throw new NotFoundException("Error creating room");
        }
    }

    public List<Room> getRoomsBySmartHomeId(Long smartHomeId) {
        return roomRepository.findBySmartHomeId(smartHomeId);
    }

    public void deleteRoom(Long roomId) {
        if (roomRepository.existsById(roomId)) {
            roomRepository.deleteById(roomId);
        } else {
            throw new NotFoundException("Room not found with ID: " + roomId);
        }
    }

    public Room updateRoom(Long id, Room room) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Room not found"));
        existingRoom.setName(room.getName());
        return roomRepository.save(existingRoom);
    }
}
