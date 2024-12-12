"use client";
import { useState, useEffect } from "react";
import styles from "./devices.module.css";
import ApiService from "../../../services/ApiService";
import { toast } from "sonner";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showScheduleModel, setShowScheduleModel] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [scheduleConfig, setScheduleConfig] = useState({
    turnOnTime: "00:00",
    turnOffTime: "00:01",
    active: "on",
  });
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "",
    room: "",
  });
  const [showDataEditModel, setShowDataEditModel] = useState(false);
  const [editDeviceData, setEditDeviceData] = useState({
    id: "",
    name: "",
    datas: {},
  });
  const [userRole, setUserRole] = useState(null);

  const fetchUserRole = async () => {
    try {
      const rank = await ApiService.getUserRank();

      if (rank === 1) {
        setUserRole("Level 1");
      } else if (rank === 2) {
        setUserRole("Level 2");
      } else if (rank === 3) {
        setUserRole("Level 3");
      }
    } catch (error) {
      console.error("Error fetching user rank:", error);
    }
  };

  useEffect(() => {
    const fetchDeviceTypes = async () => {
      try {
        const types = await ApiService.getDeviceTypes();
        setDeviceTypes(types);
        const selectedHome = await ApiService.getSelectedSmartHome();

        //get rooms for the smart home
        const roomsData = await ApiService.getRoomsBySmartHomeId(
          selectedHome.id
        );
        setRooms(roomsData);

        //get devices for the smart home
        const devicesData = await ApiService.getDevicesBySmartHomeId(
          selectedHome.id
        );
        //setDevices(devicesData);

        //devices with types and rooms and schedules
        const enrichedDevices = await Promise.all(
          devicesData.map(async (device) => {
            const deviceType = types.find(
              (type) => type.id === device.deviceTypeId
            ); // searching by type ID
            const room = roomsData.find((room) => room.id === device.roomId); // searching by room ID

            const hasSchedule = await ApiService.checkScheduleExists(device.id);

            return {
              ...device,
              type: deviceType ? deviceType.typeName : "N/A",
              room: room ? room.name : "N/A",
              datas: device.datas || {},
              hasSchedule,
            };
          })
        );

        setDevices(enrichedDevices);
      } catch (error) {
        console.log("Error fetching device types: ", error);
      }
    };
    fetchDeviceTypes();
    fetchUserRole();
  }, []);

  const addDevice = () => {
    setShowModel(true);
  };

  const handleInputChange = (e) => {
    setNewDevice({
      ...newDevice,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateDevice = async () => {
    try {
      // Call the ApiService to create the device in the backend
      const deviceData = {
        name: newDevice.name,
        type: newDevice.type,
        room: newDevice.room,
        status: 1,
      };

      const createdDevice = await ApiService.createDevice(deviceData);

      // Update the device list after creation
      setDevices([...devices, createdDevice]);

      setShowModel(false);
      setNewDevice({
        name: "",
        type: "",
        room: "",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error creating device:", error);
    }
  };

  const closeModel = () => {
    setShowModel(false);
    setNewDevice({ name: "", type: "", room: "" });
  };

  const toggleDeviceStatus = async (device) => {
    try {
      const updatedDevice =
        device.status === 0
          ? await ApiService.turnOnDevice(device.id)
          : await ApiService.turnOffDevice(device.id);

      const deviceType = deviceTypes.find(
        (type) => type.id === updatedDevice.deviceTypeId
      );
      const room = rooms.find((room) => room.id === updatedDevice.roomId);
      const hasSchedule = await ApiService.checkScheduleExists(
        updatedDevice.id
      );

      const enrichedDevice = {
        ...updatedDevice,
        type: deviceType ? deviceType.typeName : "N/A",
        room: room ? room.name : "N/A",
        hasSchedule,
        datas: updatedDevice.datas || {},
      };

      setDevices((prevDevices) =>
        prevDevices.map((d) => (d.id === device.id ? enrichedDevice : d))
      );
    } catch (error) {
      console.log("error");
    }
  };

  const handleScheduleChange = (e) => {
    setScheduleConfig({
      ...scheduleConfig,
      [e.target.name]: e.target.value,
    });
  };

  //create schedule for a device
  const saveScheduleConfig = async () => {
    try {
      if (selectedDevice) {
        const scheduleData = {
          ...scheduleConfig,
          active: scheduleConfig.active === "on" ? 1 : 0,
          deviceId: selectedDevice.id,
        };
        await ApiService.setDeviceSchedule(scheduleData); // save to the database

        // refresh the selected device
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === selectedDevice.id
              ? { ...device, hasSchedule: true }
              : device
          )
        );

        toast.success("Schedule successfully updated!");
        setShowScheduleModel(false);
        setScheduleConfig({
          turnOnTime: "",
          turnOffTime: "",
          active: "on",
        });
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  const openScheduleModel = (device) => {
    setSelectedDevice(device);
    setScheduleConfig({
      turnOnTime: device.schedule?.turnOnTime || "00:00:00",
      turnOffTime: device.schedule?.turnOffTime || "00:01:00",
      active: device.schedule?.active ? "on" : "off",
    });
    setShowScheduleModel(true);
  };

  const handleDeleteDeviceSchedule = async (deviceId) => {
    try {
      await ApiService.deleteDeviceSchedule(deviceId);
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === deviceId ? { ...device, hasSchedule: false } : device
        )
      );

      toast.success("Schedule successfully deleted!");
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Failed to delete the schedule.");
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      await ApiService.deleteDeviceById(deviceId); // call api for delete
      window.location.reload();
      toast.success("Device successfully deleted!");
    } catch (error) {
      console.error("Error deleting Device:", error);
      toast.error("Failed to delete the Device.");
    }
  };

  const handleEditDeviceSchedule = (device) => {
    setSelectedDevice(device); // actual device set
    console.log("Beallitva: ", device);
    setScheduleConfig({
      turnOnTime: device.schedule?.turnOnTime || "00:00",
      turnOffTime: device.schedule?.turnOffTime || "00:01",
      active: device.schedule?.active ? "on" : "off",
    });
    setShowUpdateModel(true);
  };

  const closeUpdateModel = () => {
    setShowUpdateModel(false);
  };

  const handleUpdateDeviceSchedule = async () => {
    console.log("selecteddevice: ", selectedDevice);
    console.log("selecteddevice.id: ", selectedDevice.id);
    if (!selectedDevice) {
      console.error("No selected device!");
      toast.error("No device selected for updating.");
      return;
    }

    try {
      const updatedScheduleData = {
        deviceId: selectedDevice,
        turnOnTime: scheduleConfig.turnOnTime,
        turnOffTime: scheduleConfig.turnOffTime,
        active: scheduleConfig.active === "on" ? 1 : 0,
      };

      const updatedSchedule = await ApiService.updateSchedule(
        updatedScheduleData
      );

      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === selectedDevice
            ? { ...device, schedule: updatedSchedule }
            : device
        )
      );

      setShowUpdateModel(false);
      setScheduleConfig({
        turnOnTime: "",
        turnOffTime: "",
        active: "on",
      });

      toast.success("Schedule successfully updated!");
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Failed to update the schedule.");
    }
  };

  const openEditDeviceDataModel = (device) => {
    setEditDeviceData({
      id: device.id,
      name: device.name,
      datas: device.datas,
    });
    setShowDataEditModel(true);
    console.log(device.id);
  };

  const closeEditDeviceDataModel = () => {
    setShowDataEditModel(false);
    setEditDeviceData({
      id: "",
      name: "",
      datas: {},
    });
  };

  const handleUpdateDeviceData = async () => {
    console.log("editDeviceData before update:", editDeviceData);
    try {
      await ApiService.updateDeviceData(editDeviceData);
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === editDeviceData.id
            ? { ...device, ...editDeviceData }
            : device
        )
      );
      closeEditDeviceDataModel();
      toast.success("Device data updated successfully!");
    } catch (error) {
      console.error("Error updating device data:", error);
      toast.error("Failed to update device data.");
    }
  };

  return (
    <div className={styles.devicesContainer}>
      <label className={styles.headerText}>Manage Devices</label>
      <div className={styles.deviceList}>
        {devices.map((device, index) => (
          <div
            key={device.id}
            className={styles.deviceItem}
            style={{
              backgroundColor: device.status === 1 ? "#1c3a63" : "#2f3b50",
            }}
          >
            {userRole === "Level 3" && (
              <>
                <div
                  className={styles.editDeviceIcon}
                  onClick={() => openEditDeviceDataModel(device)}
                >
                  <img
                    className={styles.dataIcon}
                    src="/edit_DeviceData.png"
                    alt="Edit device data"
                    width="32"
                    height="32"
                  />
                </div>
                <div
                  className={styles.scheduleIcon}
                  onClick={() =>
                    !device.hasSchedule && openScheduleModel(device)
                  }
                >
                  {device.type !== "Temperature Sensor" && (
                    <img
                      src={
                        device.hasSchedule
                          ? "/exists_schedule.png"
                          : "/add_schedule.png"
                      }
                      alt={
                        device.hasSchedule ? "Schedule exists" : "Add schedule"
                      }
                      width="32"
                      height="32"
                    />
                  )}
                </div>
                <img
                  className={styles.deleteDeviceIcon}
                  src="/deleteDevice.png"
                  alt="delete Device"
                  width="32"
                  height="32"
                  onClick={() => handleDeleteDevice(device.id)}
                />

                {device.hasSchedule && (
                  <div
                    className={styles.deleteScheduleIcon}
                    onClick={() => handleDeleteDeviceSchedule(device.id)}
                  >
                    <img
                      src="/delete_schedule.png"
                      alt="Delete schedule"
                      width="32"
                      height="32"
                    />
                  </div>
                )}
                {device.hasSchedule && (
                  <img
                    className={styles.updateDeviceScheduleIcon}
                    src="/edit_schedule.png"
                    alt="edit schedule"
                    width="32"
                    height="30"
                    onClick={() => handleEditDeviceSchedule(device.id)}
                  />
                )}
              </>
            )}

            <div
              className={styles.turnImg}
              onClick={() => toggleDeviceStatus(device)}
            >
              {device.type !== "Temperature Sensor" && (
                <img
                  src={device.status === 1 ? "/turnoff.png" : "/turnon.png"}
                  alt={device.status === 1 ? "Turn off" : "Turn on"}
                  width="32"
                  height="32"
                />
              )}
            </div>
            {device.type === "Lamp" && (
              <div className={styles.deviceImageTopLeft}>
                <img
                  src={device.status === 1 ? "/lampison.png" : "/lampisoff.png"}
                  alt={device.status === 1 ? "Lamp is on" : "Lamp is off"}
                  width="42"
                  height="42"
                />

                <p>
                  <strong>Lightpower: </strong> {device.datas.lightpower}
                </p>
              </div>
            )}

            {device.type === "Air Conditioner" && (
              <div className={styles.deviceImageTopLeft}>
                <img
                  src={device.status === 1 ? "/acison.png" : "/acisoff.png"}
                  alt={device.status === 1 ? "Ac is on" : "Ac is off"}
                  width="42"
                  height="42"
                />

                <p>
                  <strong>Temperature: </strong> {device.datas.temperature}
                </p>
              </div>
            )}

            {device.type === "Temperature Sensor" && (
              <div className={styles.deviceImageTopLeft}>
                <img
                  src={device.status === 1 ? "/tempison.png" : "/tempisoff.png"}
                  alt={
                    device.status === 1
                      ? "Temp sensor is on"
                      : "Temp sensor is off"
                  }
                  width="42"
                  height="42"
                />

                <p>
                  <strong>Temperature: </strong>{" "}
                  {device.datas.sensorTemperature}
                </p>
              </div>
            )}

            <div className={styles.deviceDetails}>
              <p className={styles.deviceNameStyle}>
                <strong>Name:</strong> {device.name}
              </p>

              <p className={styles.deviceDetailsStyle}>{device.type}</p>
              <p className={styles.deviceDetailsStyle}>
                <strong>Room:</strong> {device.room}
                {/*device.type === "Air Conditioner" && (
                  <p className={styles.deviceDetailsStyle}>
                    <strong>Temperature: </strong> {device.datas.temperature}
                  </p>
                )}
                {device.type === "Lamp" && (
                  <p className={styles.deviceDetailsStyle}>
                    <strong>Lightpower:</strong> {device.datas.lightpower}
                  </p>
                )*/}
              </p>
            </div>
          </div>
        ))}

        <div className={styles.addDoc} onClick={addDevice}>
          <img src="/plus.png" alt="Add device icon" width="70" height="70" />
        </div>
        {showModel && (
          <div className={styles.modelOverlay}>
            <div className={styles.modelContent}>
              <h2>Add new device</h2>
              <input
                type="text"
                name="name"
                placeholder="Device name"
                value={newDevice.name}
                onChange={handleInputChange}
                required
              />
              <select
                name="type"
                value={newDevice.type}
                onChange={handleInputChange}
              >
                <option value="">Device Type</option>
                {deviceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.typeName}
                  </option>
                ))}
              </select>
              <select
                name="room"
                value={newDevice.room}
                onChange={handleInputChange}
              >
                <option value="">Choose a room!</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleCreateDevice}
                className={styles.saveButton}
              >
                Save
              </button>
              <button onClick={closeModel} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {showScheduleModel && (
        <div className={styles.modelOverlay}>
          <div className={styles.modelContent}>
            <h2>Schedule Configuration</h2>
            <h4 style={{ color: "#7c8fac", margin: 10 }}>
              (Schedule for turn off and turn on)
            </h4>
            <label>Turn On Time</label>
            <input
              type="time"
              name="turnOnTime"
              value={scheduleConfig.turnOnTime}
              onChange={handleScheduleChange}
              required
            />
            <label>Turn Off Time</label>
            <input
              type="time"
              name="turnOffTime"
              value={scheduleConfig.turnOffTime}
              onChange={handleScheduleChange}
              required
            />
            <label>Status</label>
            <select
              name="active"
              value={scheduleConfig.active}
              onChange={handleScheduleChange}
            >
              <option value="on">Active: On</option>
              <option value="off">Active: Off</option>
            </select>
            <button onClick={saveScheduleConfig} className={styles.saveButton}>
              Save
            </button>
            <button
              onClick={() => setShowScheduleModel(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showUpdateModel && (
        <div className={styles.modelOverlay}>
          <div className={styles.modelContent}>
            <h2>Update Schedule</h2>
            <form>
              <label htmlFor="turnOnTime">Turn On Time</label>
              <input
                type="time"
                id="turnOnTime"
                name="turnOnTime"
                value={scheduleConfig.turnOnTime}
                onChange={handleScheduleChange}
              />

              <label htmlFor="turnOffTime">Turn Off Time</label>
              <input
                type="time"
                id="turnOffTime"
                name="turnOffTime"
                value={scheduleConfig.turnOffTime}
                onChange={handleScheduleChange}
              />

              <label htmlFor="active">Active</label>
              <select
                id="active"
                name="active"
                value={scheduleConfig.active}
                onChange={handleScheduleChange}
              >
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </form>
            <button
              className={styles.saveButton}
              onClick={handleUpdateDeviceSchedule}
            >
              Save Changes
            </button>
            <button className={styles.cancelButton} onClick={closeUpdateModel}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {showDataEditModel && (
        <div className={styles.modelOverlay}>
          <div className={styles.modelContent}>
            <h3>Edit Device Data</h3>
            <label>
              Name:
              <input type="text" value={editDeviceData.name} readOnly />
            </label>
            <h4>Datas:</h4>
            {Object.entries(editDeviceData.datas).map(([key, value]) => (
              <div key={key}>
                <label>
                  {key}:
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setEditDeviceData({
                        ...editDeviceData,
                        datas: {
                          ...editDeviceData.datas,
                          [key]: e.target.value,
                        },
                      })
                    }
                  />
                </label>
              </div>
            ))}
            <button
              className={styles.saveButton}
              onClick={handleUpdateDeviceData}
            >
              Save
            </button>
            <button
              className={styles.cancelButton}
              onClick={closeEditDeviceDataModel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;
