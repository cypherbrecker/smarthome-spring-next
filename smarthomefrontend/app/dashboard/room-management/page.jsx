import RoomManagement from "../../ui/dashboard/room-management/room-management";
import styles from "../../ui/dashboard/dashboard.module.css";
import Rightbar from "../../ui/dashboard/rightbar/rightbar";

const RoomManagementPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <RoomManagement></RoomManagement>
      </div>
      <div className={styles.side}>
        <Rightbar></Rightbar>
      </div>
    </div>
  );
};

export default RoomManagementPage;
