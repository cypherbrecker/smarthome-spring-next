"use client";
import { useState, useEffect } from "react";
import styles from "./navbar.module.css";
import ApiService from "../../../services/ApiService";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [greeting, setGreeting] = useState("Hello,");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuthenticated(ApiService.isAuthenticated());

      const fetchUserProfile = async () => {
        try {
          const response = await ApiService.getUserProfile();
          setCurrentUserName(response.name);
        } catch (error) {
          console.log("Failed to fetch user name:", error);
        }
      };

      if (isAuthenticated) {
        fetchUserProfile();
      }

      const currentHour = new Date().getHours();
      //console.log("Currenthour: ", currentHour);
      if (currentHour >= 6 && currentHour < 12) {
        setGreeting("Good Morning,");
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting("Good Afternoon,");
      } else if (currentHour >= 18 && currentHour < 24) {
        setGreeting("Good Evening,");
      } else {
        setGreeting("Good Night,");
      }
    }
  }, [isAuthenticated]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {isAuthenticated && (
          <span>
            {greeting} {currentUserName ? currentUserName + "!" : "loading.."}
          </span>
        )}
      </div>
      <div className={styles.menu}></div>
    </div>
  );
};

export default Navbar;
