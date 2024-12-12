"use client";

import { useRouter } from "next/navigation";
import styles from "./select-home.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";
import { toast } from "sonner";

const SelectHomeComponent = () => {
  const [smartHomes, setSmartHomes] = useState([]);
  const [selectedHomeId, setSelectedHomeId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSmartHomes = async () => {
      try {
        const response = await ApiService.getSmartHomes();
        setSmartHomes(response);
      } catch (error) {
        console.log("Error fetching smart homes");
      }
    };

    fetchSmartHomes();
  }, []);

  const handleSelectHome = (homeId) => {
    setSelectedHomeId(homeId);
  };

  const handleChoose = async () => {
    if (selectedHomeId) {
      try {
        const response = await ApiService.setSelectedSmartHome(selectedHomeId);
        console.log("Home selected:", response);
        toast.success("Home selected is successful!");
        router.push("/dashboard");
      } catch (error) {
        console.log("error selecting home");
      }
    }
  };

  return (
    <div className={styles.container}>
      <video className={styles.backgroundVideo} autoPlay loop muted>
        <source src="moving_background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <form action="" className={styles.form}>
        <Image
          className={styles.selectionIcon}
          src="/property-agent.png"
          alt=""
          width="76"
          height="76"
        />
        <h1 className={styles.h1Text}>Choose your home!</h1>
        {smartHomes.length > 0 ? (
          smartHomes.map((home) => (
            <button
              type="button"
              className={styles.selection}
              key={home.id}
              onClick={() => handleSelectHome(home.id)}
              style={{
                backgroundColor: selectedHomeId === home.id ? "#37bf69" : "",
              }}
            >
              {home.name}
            </button>
          ))
        ) : (
          <p>You dont have smarthome!</p>
        )}
        <button
          className={styles.doneButton}
          onClick={handleChoose}
          type="button"
        >
          Choose
        </button>
      </form>
    </div>
  );
};

export default SelectHomeComponent;
