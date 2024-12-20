"use client";
import Navbar from "../ui/dashboard/navbar/navbar";
import Sidebar from "../ui/dashboard/sidebar/sidebar";
import styles from "../ui/dashboard/dashboard.module.css";
import ProtectedRouteGuard from "../services/protectedRouteGuard";

const Layout = ({ children }) => {
  return (
    <div>
      <ProtectedRouteGuard />
      <div className={styles.container}>
        <div className={styles.menu}>
          <Sidebar></Sidebar>
        </div>
        <div className={styles.content}>
          <Navbar></Navbar>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
