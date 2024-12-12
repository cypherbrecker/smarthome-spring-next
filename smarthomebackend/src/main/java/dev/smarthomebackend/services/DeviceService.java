package dev.smarthomebackend.services;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import dev.smarthomebackend.dto.request.DeviceDataUpdateRequestDTO;
import dev.smarthomebackend.dto.request.DeviceRequestDTO;
import dev.smarthomebackend.dto.request.StatisticsRequestDTO;
import dev.smarthomebackend.dto.response.DeviceResponseDTO;
import dev.smarthomebackend.exceptions.NotFoundException;
import dev.smarthomebackend.mappers.DeviceMapper;
import dev.smarthomebackend.mappers.StatisticsMapper;
import dev.smarthomebackend.models.*;
import dev.smarthomebackend.repositories.*;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final DeviceTypeRepository deviceTypeRepository;
    private final DeviceRepository deviceRepository;
    private final RoomRepository roomRepository;
    private final SmartHomeRepository smartHomeRepository;
    private final DeviceMapper deviceMapper;
    private final StatisticsRepository statisticsRepository;
    private final StatisticsMapper statisticsMapper;

    public List<DeviceType> getAllDeviceTypes() {
        return deviceTypeRepository.findAll();
    }

    public DeviceResponseDTO createDevice(DeviceRequestDTO deviceRequestDTO) {
        Optional<Room> room = roomRepository.findById(deviceRequestDTO.getRoomId());
        Optional<DeviceType> deviceType = deviceTypeRepository.findById(deviceRequestDTO.getDeviceTypeId());

        if (room.isEmpty()) {
            throw new NotFoundException("RoomType with id " + deviceRequestDTO.getRoomId() + " not found.");
        }
        if (deviceType.isEmpty()) {
            throw new NotFoundException("DeviceType with id " + deviceRequestDTO.getDeviceTypeId() + " not found.");
        }

        if (room.isPresent() && deviceType.isPresent()) {
            Device device = deviceMapper.toEntity(deviceRequestDTO);
            device.setStatus(0);
            setDeviceData(device);
            Device savedDevice = deviceRepository.save(device);
            return deviceMapper.toDTO(savedDevice);
        } else {
            throw new RuntimeException("Error creating device");
        }
    }

    public void deleteDevice(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new NotFoundException("Device with id " + deviceId + " not found"));

        deviceRepository.delete(device);
        System.out.println("Device with id " + deviceId + " deleted successfully");
    }

    public List<DeviceResponseDTO> getDevicesBySmartHome(Long smartHomeId) {
        SmartHome smartHome = smartHomeRepository.findById(smartHomeId)
                .orElseThrow(() -> new NotFoundException("Smart home with id " + smartHomeId + " not found"));

        List<Device> devices = deviceRepository.findAllByOrderByIdAsc();

        List<Device> filteredDevices = new ArrayList<>();
        for (Device device : devices) {
            if (device.getRoom().getSmartHome().getId().equals(smartHomeId)) {
                filteredDevices.add(device);
            }
        }

        return filteredDevices.stream()
                .map(deviceMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void setDeviceData(Device device) {
        Map<String, Object> datas = new HashMap<>();
        if (device.getDeviceType().getId() == 1) { //AC
            datas.put("temperature", 0);
        } else if (device.getDeviceType().getId() == 2) { //Lamp
            datas.put("lightpower", 0);
        } else if (device.getDeviceType().getId() == 3 ) { //TempSensor
            datas.put("sensorTemperature", 0);
        } else {
            datas.put("empty", 0);
        }

        device.setDatas(datas);
    }

    public void updateDeviceData(DeviceDataUpdateRequestDTO dto) {
        Device device = deviceRepository.findById(dto.getDeviceId())
                .orElseThrow(() -> new NotFoundException("Device not found"));
        Map<String, Object> data = device.getDatas();
        data.putAll(dto.getUpdatedData());
        device.setDatas(data);
        deviceRepository.save(device);
    }

    public void saveStatistics(StatisticsRequestDTO statisticsRequestDTO) {
        Device device = deviceRepository.findById(statisticsRequestDTO.getDeviceId()).orElseThrow(() -> new NotFoundException("Device not found!"));

        Statistics statistics = statisticsMapper.toEntity(statisticsRequestDTO);

        statisticsRepository.save(statistics);

        System.out.println("Statistics saved: " + statistics);
    }

    private MqttClient mqttClient;
    private ExecutorService executorService = Executors.newFixedThreadPool(2);
    private static final String MQTT_BROKER = "IPADDRESS";
    private static final String LAMP_NAME = "LAMPNAME";
    private static final String Temp_SENSOR_NAME = "TEMPSENSORNAME";
    private static final String LAMP_TOPIC = "TOPICONZIG/" + LAMP_NAME;
    private static final String TEMPERATURE_SENSOR_TOPIC = "TOPICONZIG/" + Temp_SENSOR_NAME;
    private static final String CLIENT_ID = "CLIENTID";
    private static final String USERNAME = "USERNAME";
    private static final String PASSWORD = "PASSWORD";


    @PostConstruct
    public void initialize() {
        startMqttClient();
    }

   // @PostConstruct // not need
    public void startMqttClient() {
        try {
            //config mqtt client
             mqttClient = new MqttClient(MQTT_BROKER, CLIENT_ID, new MemoryPersistence());

            // config connection options
            MqttConnectOptions options = new MqttConnectOptions();
            options.setUserName(USERNAME);
            options.setPassword(PASSWORD.toCharArray());
            options.setCleanSession(true);
            options.setKeepAliveInterval(120); // Keep-alive intervall
            System.out.println(options.getMqttVersion());

            // connecting callback
            mqttClient.setCallback(new MqttCallback() {
                @Override
                public void connectionLost(Throwable cause) {
                    System.out.println("Connection lost: " + cause.getMessage());
                    cause.printStackTrace();
                }

                @Override
                public void messageArrived(String topic, MqttMessage message) throws Exception {
                    String payload = new String(message.getPayload());
                    System.out.println("Message received on topic " + topic + ": " + payload);

                    if (topic.equals(TEMPERATURE_SENSOR_TOPIC)) {
                        try {
                            JsonObject jsonObject = JsonParser.parseString(payload).getAsJsonObject();

                            if(jsonObject.has("temperature") && jsonObject.has("humidity")) {
                                double temperature = jsonObject.get("temperature").getAsDouble();
                                System.out.println("Received temperature: " + temperature + "°C");
                                double humidity = jsonObject.get("humidity").getAsDouble();
                                System.out.println("Received humidity: " + humidity);


                                StatisticsRequestDTO statisticsRequestDTO = new StatisticsRequestDTO();
                                statisticsRequestDTO.setDeviceId(26L); //sensor id
                                statisticsRequestDTO.setTemperature(temperature);
                                statisticsRequestDTO.setHumidity(humidity);
                                statisticsRequestDTO.setTimestamp(LocalDateTime.now());

                                executorService.submit(() -> {
                                    try {
                                        saveStatistics(statisticsRequestDTO);
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                        System.err.println("Failed to save statistics: " + e.getMessage());
                                    }
                                });
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            System.out.println("Failet to parse JSON: " + e.getMessage());
                        }
                    }

                }

                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {
                    System.out.println("Delivery complete");
                }
            });

            //connect to the broker and subscribe to the topics
            mqttClient.connect(options);
            mqttClient.subscribe(LAMP_TOPIC);
            mqttClient.subscribe(TEMPERATURE_SENSOR_TOPIC);

            System.out.println("Connected to MQTT Broker and subscribed to topic: " + LAMP_TOPIC);
            System.out.println("Connected to MQTT Broker and subscribed to topic: " + TEMPERATURE_SENSOR_TOPIC);

        } catch (MqttException e) {
            System.err.println("Error connecting to MQTT Broker: " + e.getMessage());
        }
    }

    @PreDestroy
    public void shutDownExecutor() {
        if (executorService != null && !executorService.isShutdown()) {
            executorService.shutdown();
            System.out.println("ExecutorService has been shut down.");
        }
    }

    public DeviceResponseDTO turnOnDevice(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new NotFoundException("Device is not found"));
        device.setStatus(1);
        System.out.println("Device is turned on");

        //Send the MQTT command to the lamp to turn on
        if (deviceId == 13) {
            executeMqttCommand("on");
        }

        Device savedDevice = deviceRepository.save(device);
        return deviceMapper.toDTO(savedDevice);
    }

    public DeviceResponseDTO turnOffDevice(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new NotFoundException("Device is not found"));
        device.setStatus(0);
        System.out.println("Device is turned off");

        //Send the MQTT command to the lamp to turn off
        if (deviceId == 13) {
            executeMqttCommand("off");
        }

        Device savedDevice = deviceRepository.save(device);
        return deviceMapper.toDTO(savedDevice);
    }

    private void executeMqttCommand(String command) {
        try {
            if (mqttClient == null || !mqttClient.isConnected()) {
                startMqttClient(); //connecting if it isn't connected
            }

            MqttMessage message = new MqttMessage(command.getBytes());
            mqttClient.publish("zigbee2mqtt/smart_switch/set", message);
            System.out.println("Command sent: " + command);

        } catch (MqttException e) {
            System.err.println("Error sending MQTT command: " + e.getMessage());
        }
    }
}

