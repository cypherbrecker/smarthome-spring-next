package dev.smarthomebackend.controllers;

import dev.smarthomebackend.dto.request.DeviceDataUpdateRequestDTO;
import dev.smarthomebackend.dto.request.DeviceRequestDTO;
import dev.smarthomebackend.dto.response.DeviceResponseDTO;
import dev.smarthomebackend.dto.response.DeviceTypeResponseDTO;
import dev.smarthomebackend.mappers.DeviceMapper;
import dev.smarthomebackend.services.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceService deviceService;
    private final DeviceMapper deviceMapper;

    @GetMapping("/types")
    public ResponseEntity<List<DeviceTypeResponseDTO>> getAllDeviceTypes() {
        List<DeviceTypeResponseDTO> deviceTypes = deviceService.getAllDeviceTypes()
                .stream()
                .map(deviceMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(deviceTypes);
    }

    @PostMapping("/create")
    public ResponseEntity<DeviceResponseDTO> createDevice(@RequestBody DeviceRequestDTO deviceRequestDTO) {
        DeviceResponseDTO device = deviceService.createDevice(deviceRequestDTO);
        return ResponseEntity.ok(device);
    }

    @DeleteMapping("/delete/{deviceId}")
    public ResponseEntity<String> deleteDevice(@PathVariable Long deviceId) {
        deviceService.deleteDevice(deviceId);
        return ResponseEntity.ok("Device with id " + deviceId + " deleted successfully");
    }

    @GetMapping("/user-devices")
    public ResponseEntity<List<DeviceResponseDTO>> getDevicesBySmartHome(@RequestParam Long smartHomeId) {
        List<DeviceResponseDTO> devices = deviceService.getDevicesBySmartHome(smartHomeId);
        return ResponseEntity.ok(devices);
    }

    @PutMapping("/{deviceId}/turn-on")
    public ResponseEntity<DeviceResponseDTO> turnOnDevice(@PathVariable Long deviceId) {
        DeviceResponseDTO device = deviceService.turnOnDevice(deviceId);
        return ResponseEntity.ok(device);
    }

    @PutMapping("/{deviceId}/turn-off")
    public ResponseEntity<DeviceResponseDTO> turnOffDevice(@PathVariable Long deviceId) {
        DeviceResponseDTO device = deviceService.turnOffDevice(deviceId);
        return ResponseEntity.ok(device);
    }

    @PutMapping("/update-data")
    public ResponseEntity<String> updateDeviceData(@RequestBody DeviceDataUpdateRequestDTO dto) {
        deviceService.updateDeviceData(dto);
        return ResponseEntity.ok("Device data updated successfully.");
    }
}
