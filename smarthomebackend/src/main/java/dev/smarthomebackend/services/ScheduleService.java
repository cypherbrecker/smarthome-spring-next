package dev.smarthomebackend.services;

import dev.smarthomebackend.dto.request.ScheduleRequestDTO;
import dev.smarthomebackend.dto.response.ScheduleResponseDTO;
import dev.smarthomebackend.exceptions.NotFoundException;
import dev.smarthomebackend.mappers.ScheduleMapper;
import dev.smarthomebackend.models.Schedule;
import dev.smarthomebackend.repositories.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final DeviceService deviceService;
    private final ScheduleMapper scheduleMapper;

    @Scheduled(cron = "0 * * * * *") //its running in every minute to check the active schedules.
    public void processSchedule() {
        LocalTime now = LocalTime.now().withSecond(0).withNano(0);
        List<Schedule> schedules = scheduleRepository.findAllByActive(1);
        System.out.println(schedules.toString());

        for (Schedule schedule : schedules) {
            if (schedule.getDevice().getId() == 13) {
                if (schedule.getTurnOnTime().equals(now)) {
                    deviceService.turnOnDevice(13L);
                    System.out.println("Device 13 turned ON at: " + now);
                }
                if (schedule.getTurnOffTime().equals(now)) {
                    deviceService.turnOffDevice(13L);
                    System.out.println("Device 13 truned OFF at: " + now);
                }
            }
        }

    }

    public ScheduleResponseDTO saveSchedule(ScheduleRequestDTO scheduleRequestDTO) {
        Schedule schedule = scheduleMapper.toEntity(scheduleRequestDTO);
        Schedule savedSchedule = scheduleRepository.save(schedule);

        return scheduleMapper.toDTO(savedSchedule);
    }

    @Transactional
    public void deleteByDeviceId(Long deviceId) {
        if (scheduleRepository.existsByDeviceId(deviceId)) {
            scheduleRepository.deleteByDeviceId(deviceId);
        } else {
            throw new NotFoundException("Schedule with deviceId " + deviceId + " not found");
        }
    }

    @Transactional
    public ScheduleResponseDTO updateSchedule(Long deviceId, ScheduleRequestDTO scheduleRequestDTO) {
        Schedule schedule = scheduleRepository.findByDeviceId(deviceId)
                .orElseThrow(() -> new NotFoundException("Schedule not found for deviceId: " + deviceId));

        schedule.setTurnOnTime(scheduleRequestDTO.getTurnOnTime());
        schedule.setTurnOffTime(scheduleRequestDTO.getTurnOffTime());
        schedule.setActive(scheduleRequestDTO.getActive());

        Schedule updatedSchedule = scheduleRepository.save(schedule);

        return scheduleMapper.toDTO(updatedSchedule);
    }
}
