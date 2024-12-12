import BarChartComponent from "../../ui/dashboard/barChart/barChart";
import LineChartComponent from "../../ui/dashboard/lineChart/lineChart";
import styles from "../../ui/dashboard/dashboard.module.css";

const StatisticsPage = () => {
  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <LineChartComponent></LineChartComponent>

          <BarChartComponent />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
