package dev.smarthomebackend.controllers;

import dev.smarthomebackend.dto.request.ScheduleRequestDTO;
import dev.smarthomebackend.dto.response.ScheduleResponseDTO;
import dev.smarthomebackend.repositories.ScheduleRepository;
import dev.smarthomebackend.services.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;
    private final ScheduleRepository scheduleRepository;

    @PostMapping("/save")
    public ResponseEntity<ScheduleResponseDTO> saveSchedule(@RequestBody ScheduleRequestDTO scheduleRequestDTO) {
        ScheduleResponseDTO scheduleResponseDTO = scheduleService.saveSchedule(scheduleRequestDTO);
        return ResponseEntity.ok(scheduleResponseDTO);
    }

    @GetMapping("/exists/{deviceId}")
    public ResponseEntity<Boolean> checkScheduleExists(@PathVariable Long deviceId) {
        boolean exists = scheduleRepository.existsByDeviceId(deviceId);
        return ResponseEntity.ok(exists);
    }

    @DeleteMapping("/delete/{deviceId}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long deviceId) {
        scheduleService.deleteByDeviceId(deviceId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update")
    public ResponseEntity<ScheduleResponseDTO> updateSchedule(
            @RequestBody ScheduleRequestDTO scheduleRequestDTO) {
        Long deviceId = scheduleRequestDTO.getDeviceId();
        ScheduleResponseDTO updatedSchedule = scheduleService.updateSchedule(deviceId, scheduleRequestDTO);
        return ResponseEntity.ok(updatedSchedule);
    }
}
