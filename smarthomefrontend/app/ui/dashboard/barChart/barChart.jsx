"use client";
import { useState, useEffect } from "react";
import styles from "../lineChart/lineChart.module.css";
import dataStyles from "./barChart.module.css";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import ApiService from "../../../services/ApiService";

const BarChartComponent = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ApiService.getStatisticsData(26);
        const formattedData = data.map((item) => ({
          name: new Date(item.timestamp).toLocaleString(),
          humidity: item.humidity,
          temperature: item.temperature,
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data: ", error);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      //active is cursor is on the bar, payload: it containts the data about the bar stage

      return (
        <div
          style={{
            backgroundColor: "#212121",

            padding: "10px",
          }}
        >
          <p
            className={dataStyles.dataHumidity}
          >{`Humidity: ${payload[0].value}%`}</p>
          <p
            className={dataStyles.dataTemperature}
          >{`Temperature: ${payload[1].value}°C`}</p>
          <p className={dataStyles.dataDate}>{`Date: ${label}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <h4>Bar chart</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={400}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="humidity" fill="#8884d8" />
          <Bar dataKey="temperature" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
