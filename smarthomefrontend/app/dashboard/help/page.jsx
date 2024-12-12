import Help from "../../ui/dashboard/help/help";
import styles from "../../ui/dashboard/dashboard.module.css";

const HelpPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <Help></Help>
      </div>
    </div>
  );
};

export default HelpPage;
