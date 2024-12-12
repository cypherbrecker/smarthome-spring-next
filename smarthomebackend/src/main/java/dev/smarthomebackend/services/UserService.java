package dev.smarthomebackend.services;

import dev.smarthomebackend.dto.request.PasswordChangeRequestDTO;
import dev.smarthomebackend.dto.request.SignInRequestDTO;
import dev.smarthomebackend.dto.request.UpdateUserNameRequestDTO;
import dev.smarthomebackend.dto.response.JWTResponseDTO;
import dev.smarthomebackend.dto.response.PasswordChangeResponseDTO;
import dev.smarthomebackend.dto.response.UpdateUserNameResponseDTO;
import dev.smarthomebackend.dto.response.UserResponseDTO;
import dev.smarthomebackend.exceptions.AlreadyExistsException;
import dev.smarthomebackend.exceptions.IllegalArgumentException;
import dev.smarthomebackend.exceptions.NotFoundException;
import dev.smarthomebackend.mappers.HomeAttachMapper;
import dev.smarthomebackend.mappers.UserMapper;
import dev.smarthomebackend.models.HomeAttach;
import dev.smarthomebackend.models.SmartHome;
import dev.smarthomebackend.models.User;
import dev.smarthomebackend.repositories.HomeAttachRepository;
import dev.smarthomebackend.repositories.SmartHomeRepository;
import dev.smarthomebackend.repositories.UserRepository;
import dev.smarthomebackend.utils.JwtType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService  {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtType jwtType;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final HomeAttachMapper homeAttachMapper;
    private final SmartHomeRepository smartHomeRepository;
    private final HomeAttachRepository homeAttachRepository;

    public JWTResponseDTO register(User user) {
        JWTResponseDTO jwtResponseDTO = new JWTResponseDTO();
        try {
            if (userRepository.existsByEmail(user.getUsername())) {
                throw new AlreadyExistsException(user.getEmail() + "Already Exists");
                /*System.out.println("Already exists!");*/
            }
            if (user.getRole() == null || user.getRole().isBlank()) {
                user.setRole("USER");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);

            SmartHome smartHome = new SmartHome();
            smartHome.setName(savedUser.getName() + "~s Home");
            smartHome.setRank_1("Level 1");
            smartHome.setRank_2("Level 2");
            smartHome.setRank_3("Level 3");
            SmartHome savedSmartHome = smartHomeRepository.save(smartHome);

            HomeAttach homeAttach = new HomeAttach();
            homeAttach.setUser(savedUser);
            homeAttach.setSmartHome(savedSmartHome);
            homeAttach.setRank(3);
            homeAttach.setIsLeader(1);

            homeAttachRepository.save(homeAttach);


            UserResponseDTO userResponseDTO = userMapper.userToUserResponseDTO(savedUser);
            jwtResponseDTO.setUser(userResponseDTO);
            jwtResponseDTO.setStatusCode(200);
            jwtResponseDTO.setMessage("User registered successfully and smarthome created!");

        } catch(Exception e) {
            jwtResponseDTO.setStatusCode(400);
            jwtResponseDTO.setMessage(e.getMessage());
        }
        return jwtResponseDTO;
    }

    public JWTResponseDTO login(SignInRequestDTO signInRequestDTO) {
        JWTResponseDTO jwtResponseDTO = new JWTResponseDTO();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequestDTO.getEmail(), signInRequestDTO.getPassword()));
            var user = userRepository.findByEmail(signInRequestDTO.getEmail()).orElseThrow(() -> new NotFoundException("user Not found"));

            var token = jwtType.generateToken(user);
            jwtResponseDTO.setStatusCode(200);
            jwtResponseDTO.setToken(token);
            jwtResponseDTO.setRole(user.getRole());
            jwtResponseDTO.setExpirationTime(jwtResponseDTO.getExpirationTime());
            jwtResponseDTO.setEmail(user.getEmail());
            jwtResponseDTO.setMessage("successful");

            user.setLastLogin(LocalDateTime.now());
            user.setIsOnline(1);
            userRepository.save(user);
        } catch(Exception e) {
            jwtResponseDTO.setStatusCode(400);
            jwtResponseDTO.setMessage(e.getMessage());
        }
        return jwtResponseDTO;
    }

    public void logout(String userEmail) {
        if (userEmail == null || userEmail.isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found with email: " + userEmail));

        user.setIsOnline(0);
        userRepository.save(user);
    }

    public UserResponseDTO getMyInfo(String email) throws NotFoundException {

            User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("User Not Found"));
            HomeAttach homeAttach = homeAttachRepository.findById(user.getId())
                .orElseThrow(() -> new NotFoundException("HomeAttach Not Found"));

            UserResponseDTO userResponseDTO = homeAttachMapper.homeAttachToUserResponseDTO(homeAttach);

        return userResponseDTO;

    }

    public List<UserResponseDTO> searchUsersByName(String name) {
        List<User> users = userRepository.findByNameContainingIgnoreCase(name);

        return users.stream()
                .map(userMapper::userToUserResponseDTO)
                .collect(Collectors.toList());
    }

    public UpdateUserNameResponseDTO updateUserName(String email, UpdateUserNameRequestDTO dto) {
        var user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("User not found"));

        userMapper.updateUserNameFromDTO(dto, user);
        userRepository.save(user);

        return userMapper.toUpdateUserNameResponseDTO(user);
    }


    public PasswordChangeResponseDTO changePassword(PasswordChangeRequestDTO passwordChangeRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!passwordEncoder.matches(passwordChangeRequestDTO.getOldPassword(), user.getPassword())) {
            throw new NotFoundException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(passwordChangeRequestDTO.getNewPassword()));
        userRepository.save(user);

        return userMapper.toPasswordChangeResponseDTO("Password changed successfully");
    }
}
