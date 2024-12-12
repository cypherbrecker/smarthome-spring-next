"use client";
import React, { useState, useEffect } from "react";
import ApiService from "../../services/ApiService";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import styles from "../login/login.module.css";
import regstyles from "./register.module.css";
import { toast } from "sonner";

const RegisterComponent = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isRegistered, setIsRegistered] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all the field!");
      return;
    }
    try {
      const response = await ApiService.registerUser(formData);
      if (response.statusCode === 200) {
        // clear after reg
        setFormData({
          name: "",
          email: "",
          password: "",
        });
        toast.success("User registered successfully");
        setIsRegistered(true);
      }
    } catch (error) {
      toast.error("Email is already exists!");
    }
  };

  useEffect(() => {
    if (isRegistered) {
      router.push("/login");
    }
  }, [isRegistered, router]);

  return (
    <div className={styles.container}>
      <video className={styles.backgroundVideo} autoPlay loop muted>
        <source src="moving_background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.labelText}>Name</label>
        <input
          type="text"
          placeholder="Full name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={styles.inputDesign}
          required
        />

        <label className={styles.labelText}>Email</label>
        <input
          type="email"
          placeholder="Email address"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={styles.inputDesign}
          required
        />

        <label className={styles.labelText}>Password</label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={styles.inputDesign}
          required
        />

        <button type="submit" className={regstyles.regButton}>
          Register
        </button>
        <label className={styles.infoText}>Do you have account?</label>
        <a className={styles.infoText} href="/login">
          Login here
        </a>
      </form>
    </div>
  );
};

export default RegisterComponent;
