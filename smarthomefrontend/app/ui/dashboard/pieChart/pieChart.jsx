import React, { useState, useEffect } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import styles from "../lineChart/lineChart.module.css";
import ApiService from "../../../services/ApiService";

const PieChartComponent = () => {
  const [averageTemperature, setAverageTemperature] = useState(0);
  // console.log(valuePercentage);

  useEffect(() => {
    const fetchAverageTemperature = async () => {
      try {
        const temp = await ApiService.getAverageTemperature(26, "2024-11-28");
        setAverageTemperature(temp);
      } catch (error) {
        console.error("Error fetching average temperature:", error);
      }
    };

    fetchAverageTemperature();
  }, []);

  const data = [{ name: "Temperature", value: averageTemperature }];
  //console.log("Average temperature: ", averageTemperature);

  return (
    <div className={styles.container}>
      <h4>
        Average Temperature was {averageTemperature.toFixed(2)} °C on 28
        November 2024
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={85}
            fill="#d3d3d3" // background ring color
            startAngle={0}
            endAngle={360} // Full 360 degrees for the background
            isAnimationActive={false} // Disable animation for static background
            stroke="none"
          />
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={85}
            fill="#2589ff"
            label
            startAngle={0}
            /*endAngle={valuePercentage}*/
            endAngle={averageTemperature}
            stroke="none"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
