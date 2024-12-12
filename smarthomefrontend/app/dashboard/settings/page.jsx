import Rightbar from "../../ui/dashboard/rightbar/rightbar";
import Settings from "../../ui/dashboard/settings/settings";
import styles from "../../ui/dashboard/dashboard.module.css";

const SettingsPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <Settings></Settings>
      </div>
      <div className={styles.side}>
        <Rightbar></Rightbar>
      </div>
    </div>
  );
};

export default SettingsPage;
