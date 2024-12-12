package dev.smarthomebackend.controllers;

import dev.smarthomebackend.dto.request.AverageTemperatureRequestDTO;
import dev.smarthomebackend.dto.request.StatisticsForBarChartRequestDTO;
import dev.smarthomebackend.models.Statistics;
import dev.smarthomebackend.services.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @PostMapping("/average-temperature")
    public ResponseEntity<Double> getAverageTemperature(@RequestBody AverageTemperatureRequestDTO requestDTO) {
        Double avgTemperature = statisticsService.calculateAverageTemperature(requestDTO);
        if (avgTemperature == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(avgTemperature);
    }

    @PostMapping("/data")
    public ResponseEntity<List<Statistics>> getStatisticsByDeviceId(@RequestBody StatisticsForBarChartRequestDTO requestDTO) {
        List<Statistics> statistics = statisticsService.getDeviceStatistics(requestDTO.getDeviceId());
        if (statistics.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(statistics);
    }

}
