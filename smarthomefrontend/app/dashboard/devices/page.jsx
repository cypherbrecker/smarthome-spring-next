import Rightbar from "../../ui/dashboard/rightbar/rightbar";
import styles from "../../ui/dashboard/dashboard.module.css";
import Device from "../../ui/dashboard/devices/devices";

const DevicesPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <Device></Device>
      </div>
      <div className={styles.side}>
        <Rightbar></Rightbar>
      </div>
    </div>
  );
};

export default DevicesPage;
