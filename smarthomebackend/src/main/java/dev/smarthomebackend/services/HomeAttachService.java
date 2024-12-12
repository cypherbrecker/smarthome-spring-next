package dev.smarthomebackend.services;

import dev.smarthomebackend.dto.response.UserResponseDTO;
import dev.smarthomebackend.exceptions.AlreadyExistsException;
import dev.smarthomebackend.exceptions.NotFoundException;
import dev.smarthomebackend.mappers.HomeAttachMapper;
import dev.smarthomebackend.models.HomeAttach;
import dev.smarthomebackend.models.SmartHome;
import dev.smarthomebackend.models.User;
import dev.smarthomebackend.repositories.HomeAttachRepository;
import dev.smarthomebackend.repositories.SmartHomeRepository;
import dev.smarthomebackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HomeAttachService {

    private final SmartHomeRepository smartHomeRepository;
    private final HomeAttachRepository homeAttachRepository;
    private final UserRepository userRepository;
    private final HomeAttachMapper homeAttachMapper;

   public void addUserToSmartHome(Long userId, Long smartHomeId) {

       boolean alreadyAttached = homeAttachRepository.existsByUserIdAndSmartHomeId(userId, smartHomeId);
       if (alreadyAttached) {
           throw new AlreadyExistsException("User is already attached to this smart home!");
       }

       User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
       SmartHome smartHome = smartHomeRepository.findById(smartHomeId).orElseThrow(() -> new NotFoundException("Home is not found"));

       HomeAttach homeAttach = new HomeAttach();
       homeAttach.setUser(user);
       homeAttach.setRank(1);
       homeAttach.setSmartHome(smartHome);

       homeAttachRepository.save(homeAttach);
   }

   public void removeUserFromSmartHome(Long userId, Long smartHomeId) {
       Optional<HomeAttach> homeAttach = homeAttachRepository.findByUserIdAndSmartHomeId(userId, smartHomeId);

       if (homeAttach.isPresent()) {
           homeAttachRepository.delete(homeAttach.get());
       } else {
           throw new NotFoundException("User is not attached to this smart home!");
       }
   }

    public void assignRankToUser(Long userId, Long smartHomeId, Integer rank) {
        var user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException(("User not found")));

        var smartHome = smartHomeRepository.findById(smartHomeId).orElseThrow(() -> new NotFoundException("Smart home not found"));

        var homeAttach = homeAttachRepository.findByUserIdAndSmartHomeId(userId, smartHomeId).orElseThrow(() -> new NotFoundException("User is not attached  to this smarthome"));

        homeAttach.setRank(rank);
        homeAttachRepository.save(homeAttach);
    }


    public UserResponseDTO isUserLeaderInSelectedSmartHome(String userEmail) throws Exception {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        //get the id of the selected home
        Long selectedSmartHomeId = user.getSelectedSmartHomeId();
        if (selectedSmartHomeId == null) {
            throw new RuntimeException("No selected smart home for user");
        }

        //searching homeattach record by user and smarthome
        HomeAttach homeAttach = homeAttachRepository.findByUserIdAndSmartHomeId(user.getId(), selectedSmartHomeId)
                .orElseThrow(() -> new NotFoundException("HomeAttach not found for selected smart home"));

        UserResponseDTO userResponseDTO = homeAttachMapper.homeAttachToUserResponseDTO(homeAttach);

        return userResponseDTO;
    }

    public Integer getUserRank(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        Long smartHomeId = user.getSelectedSmartHomeId();

        return homeAttachRepository.findByUserIdAndSmartHomeId(user.getId(), smartHomeId)
                .map(HomeAttach::getRank)
                .orElseThrow(() -> new NotFoundException("No rank found for user in selected smart home"));
    }
}
