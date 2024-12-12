"use client";
import { useState, useEffect } from "react";
import MenuLink from "./menuLink/menuLink";
import styles from "./sidebar.module.css";
import Image from "next/image";
import ApiService from "../../../services/ApiService";
import { useRouter } from "next/navigation";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
  MdGroup,
  MdHomeWork,
  MdDeviceHub,
  MdDataExploration,
  MdHome,
} from "react-icons/md";

const menuItems = [
  {
    title: "",
    list: [
      {
        title: "Home",
        path: "/dashboard",
        icon: <MdDashboard size={20} />,
      },
      {
        title: "Devices",
        path: "/dashboard/devices",
        icon: <MdDeviceHub size={20} />,
      },
      {
        title: "Team",
        path: "/dashboard/team",
        icon: <MdGroup size={20} />,
      },
      {
        title: "Room Management",
        path: "/dashboard/room-management",
        icon: <MdHomeWork size={20} />,
      },
      {
        title: "Statistics",
        path: "/dashboard/statistics",
        icon: <MdDataExploration size={20} />,
      },
    ],
  },
  {
    title: "Rooms",
    list: [],
  },
  {
    title: "Actions",
    list: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings size={20} />,
      },
      {
        title: "Help",
        path: "/dashboard/help",
        icon: <MdHelpCenter size={20} />,
      },
    ],
  },
];

const Sidebar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  const fetchUserRole = async () => {
    try {
      const rank = await ApiService.getUserRank();
      //console.log("rank: ", rank);
      if (rank === 1) {
        setUserRole("Level 1");
      } else if (rank === 2) {
        setUserRole("Level 2");
      } else if (rank === 3) {
        setUserRole("Level 3");
      }
    } catch (error) {
      console.error("Error fetching user rank:", error);
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      // First, fetch the selected smart home to get the ID
      const smartHome = await ApiService.getSelectedSmartHome();
      const smartHomeId = smartHome.id;

      // Then, fetch rooms using the smart home ID
      const data = await ApiService.getRoomsBySmartHomeId(smartHomeId);
      setRooms(data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch rooms.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuthenticated(ApiService.isAuthenticated());

      const fetchUserProfile = async () => {
        try {
          const response = await ApiService.getUserProfile();
          setCurrentUserName(response.name);
        } catch (error) {
          console.log("Failed to fetch user name:", error);
        }
      };

      fetchUserProfile();
      fetchRooms();
      fetchUserRole();
    }
  }, []);

  const handleDeleteRoom = async (roomId) => {
    /* console.log("roomid: ", roomId);
    await ApiService.deleteRoom(roomId);*/
    if (window.confirm("Are you sure you want to delete this room?")) {
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
      try {
        console.log(roomId);
        await ApiService.deleteRoom(roomId);
        fetchRooms();
      } catch (error) {
        console.error("Failed to delete room:", error);

        fetchRooms();
      }
    }
  };

  const handleLogout = () => {
    const isLogout = window.confirm("Are you sure you want to logout?");
    if (isLogout) {
      ApiService.logout();
      router.push("/login");
    }
  };

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.title === "Rooms" && (
              <ul>
                {loading && <li>Loading rooms...</li>}
                {error && <li>{error}</li>}
                {!loading && rooms.length === 0 && (
                  <p style={{ color: "#ed6258" }}>
                    Don’t have rooms in this home!
                  </p>
                )}

                {!loading &&
                  rooms.map((room) => (
                    <MenuLink
                      item={{
                        title: `${room.name} (${room.roomType.typeName})`,
                        path: ``,
                        icon: <MdHome size={20} />,
                      }}
                      key={room.id}
                      {...(userRole === "Level 2" || userRole === "Level 3"
                        ? { onDelete: () => handleDeleteRoom(room.id) } // only for the specific user can see it
                        : {})}
                    />
                  ))}
              </ul>
            )}
            {cat.title !== "Rooms" &&
              cat.list.map((item) => <MenuLink item={item} key={item.title} />)}
          </li>
        ))}
      </ul>
      {isAuthenticated && (
        <div className={styles.user}>
          <Image
            className={styles.userImage}
            src="/useravatar.png"
            alt=""
            width="50"
            height="50"
          />
          <div className={styles.userDetail}>
            <span className={styles.username}>
              {currentUserName ? currentUserName : "loading.."}
            </span>
            <span className={styles.userTitle}>Admin</span>
          </div>
          <Image
            className={styles.userLogoutImage}
            src="/logout.png"
            alt=""
            width="32"
            height="32"
            onClick={handleLogout}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
