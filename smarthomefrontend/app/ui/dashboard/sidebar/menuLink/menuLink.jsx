"use client";
import { usePathname } from "next/navigation";
import styles from "./menuLink.module.css";
import Link from "next/link";
import { MdDelete } from "react-icons/md";

const MenuLink = ({ item, onDelete }) => {
  const pathname = usePathname();

  return (
    <div className={styles.menuItem}>
      <Link
        href={item.path}
        className={`${styles.container} ${
          pathname === item.path && styles.active
        }`}
      >
        {item.icon}
        {item.title}
      </Link>
      {onDelete && (
        <span
          className={styles.trashIcon}
          onClick={onDelete}
          title="Delete Room"
        >
          <MdDelete size={25} />
        </span>
      )}
    </div>
  );
};

export default MenuLink;
