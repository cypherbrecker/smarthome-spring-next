"use client";
import React, { useState, useEffect } from "react";
import ApiService from "../../../services/ApiService";
import styles from "./room-management.module.css";

const RoomManagement = () => {
  const [userRole, setUserRole] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("");
  const [updateRoomName, setUpdateRoomName] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [message, setMessage] = useState("");

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
    const fetchRoomTypes = async () => {
      const types = await ApiService.getRoomTypes();
      setRoomTypes(types);
    };
    const fetchRooms = async () => {
      const selectedHome = await ApiService.getSelectedSmartHome();
      const fetchedRooms = await ApiService.getRoomsBySmartHomeId(
        selectedHome.id
      );
      setRooms(fetchedRooms); // Fetch and set rooms for the selected smart home
    };

    fetchRoomTypes();
    fetchRooms();
    fetchUserRole();
  }, []);

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    const selectedHome = await ApiService.getSelectedSmartHome();
    try {
      const response = await ApiService.createRoom({
        name: roomName,
        smartHomeId: selectedHome.id,
        roomTypeId: roomType,
      });

      setMessage("Room created successfully!");
      setRoomName("");
      setRoomType("");
      window.location.reload();
    } catch (error) {
      setMessage("Failed to create room. Please try again.");
      console.error(error);
    }
  };

  const handleUpdateRoom = async (event) => {
    event.preventDefault();
    const selectedHome = await ApiService.getSelectedSmartHome();
    try {
      await ApiService.updateRoom(selectedRoom, {
        name: updateRoomName,
        smartHomeId: selectedHome.id,
      });
      setMessage("Room updated successfully!");
      setUpdateRoomName("");
      setSelectedRoom("");
      window.location.reload();
    } catch (error) {
      setMessage("Failed to update room. Please try again.");
      console.error(error);
    }
  };
  //console.log("USERRANK: ", userRole);
  return (
    <>
      <label className={styles.headerText}>
        Manage Rooms in Your Smart Home
      </label>
      {userRole === "Level 2" || userRole === "Level 3" ? (
        <div className={styles.flexContainer}>
          <div className={styles.container}>
            <form onSubmit={handleCreateRoom} className={styles.form}>
              <label className={styles.label}>Room Name</label>
              <input
                type="text"
                placeholder="Room's name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                className={styles.input}
              />
              <label className={styles.label}>Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                required
                className={styles.input}
              >
                <option value="" disabled>
                  Select a type
                </option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.typeName}
                  </option>
                ))}
              </select>

              <button type="submit" className={styles.button}>
                Create Room
              </button>
            </form>
          </div>
          <div className={styles.container}>
            <form onSubmit={handleUpdateRoom} className={styles.form}>
              <label className={styles.label}>Update Room</label>
              <select
                value={selectedRoom}
                onChange={(e) => {
                  setSelectedRoom(e.target.value);
                  const roomToUpdate = rooms.find(
                    (room) => room.id === e.target.value
                  );
                  if (roomToUpdate) {
                    setUpdateRoomName(roomToUpdate.name);
                  }
                }}
                required
                className={styles.input}
              >
                <option value="" disabled>
                  Select a room to update
                </option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
              <label className={styles.label}>Room Name</label>
              <input
                type="text"
                placeholder="Room's name"
                value={updateRoomName}
                onChange={(e) => setUpdateRoomName(e.target.value)} // Update room name
                required
                className={styles.input}
              />

              <button type="submit" className={styles.buttonGreen}>
                Update Room
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p>You do not have the necessary permissions to manage rooms.</p> // Show message for users without permissions
      )}
      {message && <p className={styles.message}>{message}</p>}
    </>
  );
};

export default RoomManagement;
