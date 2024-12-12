"use client";
import { useState, useEffect } from "react";
import styles from "./settings.module.css";
import ApiService from "../../../services/ApiService";

const Settings = () => {
  const [name, setName] = useState(""); // User name
  const [message, setMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Fetch the current user's name when the component loads
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userData = await ApiService.getUserProfile();
        setName(userData.name); // Set initial name from profile data
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserName();
  }, []);

  // Update name input state
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await ApiService.updateUserName({ name });
      setMessage("Name updated successfully!");
      window.location.reload();
    } catch (error) {
      setMessage("Error updating name. Please try again.");
      console.error("Error updating name:", error);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      await ApiService.updatePassword({ oldPassword, newPassword });
      setPasswordMessage("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      window.location.reload();
    } catch (error) {
      setPasswordMessage("Error updating password. Please try again.");
      console.error("Error updating password:", error);
    }
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Profile</h2>
      <div className={styles.mainContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
            className={styles.input}
          ></input>
          <button type="submit" className={styles.button}>
            Update Name
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>

      <div className={styles.mainContainer}>
        <form onSubmit={handleSubmitPassword} className={styles.form}>
          <label className={styles.label}>Current Password</label>
          <input
            type="password"
            value={oldPassword}
            placeholder="Your current password"
            onChange={handleOldPasswordChange}
            required
            className={styles.input}
          />
          <label className={styles.label}>New Password</label>
          <input
            type="password"
            value={newPassword}
            placeholder="Your new password"
            onChange={handleNewPasswordChange}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Update Password
          </button>
        </form>
        {passwordMessage && <p className={styles.message}>{passwordMessage}</p>}
      </div>
    </div>
  );
};

export default Settings;
