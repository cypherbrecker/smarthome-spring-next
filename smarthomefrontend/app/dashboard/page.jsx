"use client";

import styles from "../ui/dashboard/dashboard.module.css";
import { useEffect, useState } from "react";
import ApiService from "../services/ApiService";
import PieChartComponent from "../ui/dashboard/pieChart/pieChart";
import BarChartComponent from "../ui/dashboard/barChart/barChart";
import AreaChartComponent from "../ui/dashboard/areaChart/areaChart";
import PosAndNegChartComponent from "../ui/dashboard/posAndNegChart/posAndNegChart";
import ProtectedRouteGuard from "../services/protectedRouteGuard";

const Dashboard = () => {
  const [homeName, setHomeName] = useState();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        //console.log("Fetching smart home data...");
        const home = await ApiService.getSelectedSmartHome();
        //console.log("Fetched home data:", home);
        setHomeName(home.name);
      } catch (error) {
        console.log("error fetching smart home data");
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div>
      <ProtectedRouteGuard />

      <div className={styles.wrapper}>
        <div className={styles.main}>
          <div className={styles.chartsContainer}>
            {homeName === "hell x~s Home" && (
              <div className={styles.chartItem}>
                <BarChartComponent />
              </div>
            )}
            {homeName === "hell x~s Home" && (
              <div className={styles.chartItem}>
                <PieChartComponent />
              </div>
            )}
            <div className={styles.chartItem}>
              <AreaChartComponent />
            </div>
            <div className={styles.chartItem}>
              <PosAndNegChartComponent />
            </div>
          </div>
        </div>
        <div className={styles.side}>
          <h3>Welcome to the dashboard of your {homeName || "loading..."}!</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
