package dev.smarthomebackend.services;

import dev.smarthomebackend.dto.response.SmartHomeNameResponseDTO;
import dev.smarthomebackend.dto.response.UserSmartHomeResponseDTO;
import dev.smarthomebackend.exceptions.NotFoundException;
import dev.smarthomebackend.mappers.HomeAttachMapper;
import dev.smarthomebackend.mappers.SmartHomeMapper;
import dev.smarthomebackend.models.HomeAttach;
import dev.smarthomebackend.models.SmartHome;
import dev.smarthomebackend.models.User;
import dev.smarthomebackend.repositories.HomeAttachRepository;
import dev.smarthomebackend.repositories.SmartHomeRepository;
import dev.smarthomebackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SmartHomeService {

    private final HomeAttachRepository homeAttachRepository;
    private final UserRepository userRepository;
    private final SmartHomeRepository smartHomeRepository;
    private final SmartHomeMapper smartHomeMapper;
    private final HomeAttachMapper homeAttachMapper;

    public List<SmartHome> getSmartHomeByUser (String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        List<HomeAttach> homeAttachList = homeAttachRepository.findByUser(user);
        return homeAttachList.stream()
                .map(HomeAttach::getSmartHome)
                .collect(Collectors.toList());
    }

    public void setSelectedSmartHome(String userEmail, Long homeId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        user.setSelectedSmartHomeId(homeId);
        userRepository.save(user);
    }

    public SmartHomeNameResponseDTO getSelectedSmartHome(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Long selectedHomeId = user.getSelectedSmartHomeId();
        SmartHome selectedHome = smartHomeRepository.findById(selectedHomeId)
                .orElseThrow(() -> new NotFoundException("Smart Home not found"));

        return smartHomeMapper.smartHomeToSmartHomeNameDTO(selectedHome);
    }

    public List<UserSmartHomeResponseDTO> getUsersBySmartHome(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Long selectedSmartHomeId = user.getSelectedSmartHomeId();
        SmartHome selectedSmartHome = smartHomeRepository.findById(selectedSmartHomeId)
                .orElseThrow(() -> new NotFoundException("Smart Home not found"));

        List<HomeAttach> homeAttachList = homeAttachRepository.findBySmartHome(selectedSmartHome);

        return homeAttachList.stream()
                .map(attach -> {
                    UserSmartHomeResponseDTO userDTO = homeAttachMapper.homeAttachToUserSmartHomeDTO(attach);

                    userDTO.setRankInt(attach.getRank());

                    String rankName = getRankName(attach.getRank(), selectedSmartHome);
                    userDTO.setRank(rankName);

                    return userDTO;
                }).collect(Collectors.toList());
    }

    private String getRankName(Integer rank, SmartHome smartHome) {
        switch (rank) {
            case 1:
                return smartHome.getRank_1();
            case 2:
                return smartHome.getRank_2();
            case 3:
                return smartHome.getRank_3();
            default:
                return "Unknown";
        }
    }
}
