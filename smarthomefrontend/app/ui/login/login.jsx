"use client";
import React, { useState, useEffect } from "react";
import styles from "./login.module.css";
import ApiService from "../../services/ApiService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LoginComponent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all the fields!");
      return;
    }

    try {
      const response = await ApiService.loginUser(formData);
      if (response.statusCode === 200) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        // console.log("JWT Token: ", response.token);
        toast.success("Logged in!");
        router.push("/select-home");
      }
    } catch (error) {
      toast.error("Bad datas!");
    }
  };

  return (
    <div className={styles.container}>
      <video className={styles.backgroundVideo} autoPlay loop muted>
        <source src="moving_background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.labelText}>Email </label>
        <input
          type="email"
          placeholder="Email address"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={styles.inputDesign}
          required
        />
        <label className={styles.labelText}>Password </label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={styles.inputDesign}
          required
        />
        <button type="submit" className={styles.regButton}>
          Login
        </button>
        <label className={styles.infoText}>Don't have an account?</label>
        <a className={styles.infoText} href="/register">
          Register here
        </a>
      </form>
    </div>
  );
};

export default LoginComponent;
