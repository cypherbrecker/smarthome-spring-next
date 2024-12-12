import axios from "axios";

export default class ApiService {
  static BASE_URL = "http://localhost:8080";

  //get token
  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  //register user
  static async registerUser(registration) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/register`,
      registration
    );
    return response.data;
  }

  //login user
  static async loginUser(loginDetails) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/login`,
      loginDetails
    );

    if (response.data && response.data.email) {
      localStorage.setItem("email", response.data.email); // Email storage
    }

    return response.data;
  }

  //get back datas from logged user
  static async getUserProfile() {
    const response = await axios.get(
      `${this.BASE_URL}/users/get-logged-in-profile-info`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  //check a logged user in a selected smarthome that he is leader or no
  static async getUserIsLeaderInSelectedHome() {
    const response = await axios.get(
      `${this.BASE_URL}/homeattach/check-leader`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  //return every smarthome for 1 user
  static async getSmartHomes() {
    const response = await axios.get(
      `${this.BASE_URL}/api/smarthomes/user/homes`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // Set the selected smart home in the backend/session
  static async setSelectedSmartHome(homeId) {
    const response = await axios.post(
      `${this.BASE_URL}/api/smarthomes/set-selected`,
      homeId,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // Get the selected smart home details
  static async getSelectedSmartHome() {
    const response = await axios.get(
      `${this.BASE_URL}/api/smarthomes/get-selected-home`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  //return all users who are in the same home
  static async getUsersBySelectedSmartHome() {
    const response = await axios.get(
      `${this.BASE_URL}/api/smarthomes/selected-home/users`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  //search user to add to the house
  static async searchUsersByName(name) {
    const response = await axios.get(`${this.BASE_URL}/users/search`, {
      headers: this.getHeader(),
      params: { name },
    });
    return response.data;
  }

  //add user to the house
  static async addUserToSmartHome(userId, smartHomeId) {
    const response = await axios.post(
      `${this.BASE_URL}/homeattach/add-user?userId=${userId}&smartHomeId=${smartHomeId}`,
      null,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  //remove user from the house
  static async removeUserFromSmartHome(userId, smartHomeId) {
    const response = await axios.delete(
      `${this.BASE_URL}/homeattach/remove-user?userId=${userId}&smartHomeId=${smartHomeId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  //set the rank of the user in the house
  static async assignRankToUser(userId, smartHomeId, rank) {
    const response = await axios.post(
      `${this.BASE_URL}/homeattach/assignRank?userId=${userId}&smartHomeId=${smartHomeId}&rank=${rank}`,
      null,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getUserRank() {
    const response = await axios.get(`${this.BASE_URL}/homeattach/user/rank`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async logout() {
    if (this.isAuthenticated()) {
      try {
        // getting email from storage
        const email = localStorage.getItem("email");
        console.log(email);

        // Send the logout request
        await axios.post(
          `${this.BASE_URL}/auth/logout`,
          { email },
          {
            headers: this.getHeader(),
          }
        );

        // Clear localStorage on successful logout
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    } else {
      console.warn("User is not authenticated, cannot logout.");
    }
  }

  static async updateUserName(updateUserNameRequestDTO) {
    const response = await axios.put(
      `${this.BASE_URL}/users/update-name`,
      updateUserNameRequestDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updatePassword(updatePasswordRequestDTO) {
    const response = await axios.put(
      `${this.BASE_URL}/users/change-pwd`,
      updatePasswordRequestDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /*Room endpoints start*/
  static async getRoomTypes() {
    const response = await axios.get(`${this.BASE_URL}/api/rooms/types`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async createRoom(roomData) {
    const response = await axios.post(
      `${this.BASE_URL}/api/rooms/create`,
      {
        name: roomData.name,
        smartHomeId: roomData.smartHomeId,
        roomTypeId: roomData.roomTypeId,
      },
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // return all rooms for a selected smart home
  static async getRoomsBySmartHomeId(smartHomeId) {
    const response = await axios.post(
      `${this.BASE_URL}/api/rooms/smarthome/rooms`,
      smartHomeId, // send smartHomeId in the request body
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteRoom(roomId) {
    const response = await axios.delete(
      `${this.BASE_URL}/api/rooms/${roomId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateRoom(roomId, roomData) {
    const response = await axios.put(
      `${this.BASE_URL}/api/rooms/${roomId}`,
      {
        name: roomData.name,
        smartHomeId: roomData.smartHomeId,
      },
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }
  /*Room endpoints end*/

  /*Device endpoints start*/

  static async getDeviceTypes() {
    const response = await axios.get(`${this.BASE_URL}/api/devices/types`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async createDevice(deviceData) {
    const response = await axios.post(
      `${this.BASE_URL}/api/devices/create`,
      {
        name: deviceData.name,
        deviceTypeId: deviceData.type,
        roomId: deviceData.room,
        status: deviceData.status || 0,
      },
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteDeviceById(deviceId) {
    const response = await axios.delete(
      `${this.BASE_URL}/api/devices/delete/${deviceId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getDevicesBySmartHomeId(smartHomeId) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/api/devices/user-devices?smartHomeId=${smartHomeId}`,
        {
          headers: this.getHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching devices: ", error);
      throw error;
    }
  }

  static async turnOnDevice(deviceId) {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/api/devices/${deviceId}/turn-on`,
        null,
        {
          headers: this.getHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error turning on device: ", error);
      throw error;
    }
  }

  // Turn off a device by deviceId
  static async turnOffDevice(deviceId) {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/api/devices/${deviceId}/turn-off`,
        null,
        {
          headers: this.getHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error turning off device: ", error);
      throw error;
    }
  }

  static async updateDeviceData(deviceData) {
    const payload = {
      deviceId: deviceData.id,
      updatedData: deviceData.datas,
    };

    console.log("Payload being sent to API:", payload);

    try {
      const response = await axios.put(
        `${this.BASE_URL}/api/devices/update-data`,
        payload,
        {
          headers: this.getHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating device data:", error);
      throw error;
    }
  }

  /*Device endpoints end */

  /*Schedule endpoints start */
  static async setDeviceSchedule(scheduleData) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/api/schedule/save`,
        {
          deviceId: scheduleData.deviceId,
          turnOnTime: scheduleData.turnOnTime,
          turnOffTime: scheduleData.turnOffTime,
          active: scheduleData.active || 0, // default is 0
        },
        {
          headers: this.getHeader(),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error saving schedule:", error);
      throw error;
    }
  }

  static async checkScheduleExists(deviceId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/schedule/exists/${deviceId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteDeviceSchedule(deviceId) {
    const response = await axios.delete(
      `${this.BASE_URL}/api/schedule/delete/${deviceId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateSchedule(scheduleData) {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/api/schedule/update`,
        {
          deviceId: scheduleData.deviceId,
          turnOnTime: scheduleData.turnOnTime,
          turnOffTime: scheduleData.turnOffTime,
          active: scheduleData.active || 0,
        },
        {
          headers: this.getHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  }

  /*Schedule endpoints end */

  /*Statistics endpoints start */
  static async getAverageTemperature(deviceId, date) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/api/statistics/average-temperature`,
        {
          deviceId,
          date,
        },
        {
          headers: this.getHeader(),
        }
      );
      return response.data || 0;
    } catch (error) {
      console.error("Error getting avg-temp:", error);
      throw error;
    }
  }

  static async getStatisticsData(deviceId) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/api/statistics/data`,
        {
          deviceId,
        },
        {
          headers: this.getHeader(),
        }
      );
      return response.data || [];
    } catch (error) {
      console.error("Error getting statisticsData:", error);
      throw error;
    }
  }

  /*Statistics endpoints end */

  static isAuthenticated() {
    if (typeof window === "undefined") {
      //on server side always return false
      return false;
    }

    const token = localStorage.getItem("token");
    return !!token;
  }
}
