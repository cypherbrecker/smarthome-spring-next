package dev.smarthomebackend.services;

import dev.smarthomebackend.dto.request.AverageTemperatureRequestDTO;
import dev.smarthomebackend.models.Statistics;
import dev.smarthomebackend.repositories.StatisticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final StatisticsRepository statisticsRepository;

    public Double calculateAverageTemperature(AverageTemperatureRequestDTO requestDTO) {
        LocalDate targetDate = LocalDate.parse(requestDTO.getDate());
        return statisticsRepository.calculateAverageTemperature(requestDTO.getDeviceId(), targetDate);
    }

    public List<Statistics> getDeviceStatistics(Long deviceId) {
        return statisticsRepository.findByDeviceIdOrderByTimestampDesc(deviceId);
    }
}
