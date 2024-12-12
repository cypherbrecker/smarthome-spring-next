"use client";

import { useState, useEffect, use } from "react";
import styles from "./team.module.css";
import ApiService from "../../../services/ApiService";
import {
  FaRegTrashAlt,
  FaPlusCircle,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import classNames from "classnames";
import { toast } from "sonner";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentUserIsLeader, setCurrentUserIsLeader] = useState(false);

  useEffect(() => {
    ApiService.getUserProfile()
      .then((response) => {
        setCurrentUserId(response.id);
        // console.log("ID:", response.isLeader, "Char id: ", response.id);
        //setCurrentUserIsLeader(response.isLeader === 1);
      })
      .catch((error) => console.log("error fetching logged-user profile id."));

    ApiService.getUserIsLeaderInSelectedHome()
      .then((response) => {
        // console.log("DATA::", response);
        setCurrentUserIsLeader(response.isLeader === 1);
      })
      .catch((error) => console.log("error fetching logged-user profile id."));

    ApiService.getSelectedSmartHome()
      .then((response) => {
        // setOwnerId(response.ownerId);
        return ApiService.getUsersBySelectedSmartHome();
      })
      .then((response) => {
        //console.log("API Response:", response);
        setUsers(response);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      })
      .finally(() => setLoading(false));
  }, []);

  //console.log("leader: ", currentUserIsLeader);
  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchMode(true);
    if (query.length > 1) {
      ApiService.searchUsersByName(query)
        .then((response) => setSearchResults(response))
        .catch((error) => console.log("Error searching users:", error));
    } else {
      setSearchResults([]);
    }
  };

  const handleAddUser = async (userId) => {
    try {
      const smartHomeResponse = await ApiService.getSelectedSmartHome();
      const smartHomeId = smartHomeResponse.id;

      await ApiService.addUserToSmartHome(userId, smartHomeId);

      const response = await ApiService.getUsersBySelectedSmartHome();
      setUsers(response);
      setSearchMode(false);
      setSearchQuery("");
    } catch (error) {
      console.log("Error adding user: ", error);
      if (error.response && error.response.data) {
        alert(error.response.data);
      }
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      const smartHomeResponse = await ApiService.getSelectedSmartHome();
      const smartHomeId = smartHomeResponse.id;

      //console.log("values: " + smartHomeId, userId);

      if (!smartHomeId) {
        console.log("Smart Home ID is undefined or null");
      }

      await ApiService.removeUserFromSmartHome(userId, smartHomeId);

      const response = await ApiService.getUsersBySelectedSmartHome();
      setUsers(response);
      toast.success("Successfully deleted the user!");
    } catch (error) {
      console.log("Error removing user: ", error);
    }
  };

  const assignRank = async (userId, direction) => {
    try {
      const smartHomeResponse = await ApiService.getSelectedSmartHome();
      const smartHomeId = smartHomeResponse.id;

      const userResponse = await ApiService.getUsersBySelectedSmartHome();
      const user = userResponse.find((u) => u.id === userId);

      if (!user) {
        console.log("User not found");
        return;
      }

      const currentRank = user.rankInt; // get the rank from DTO
      console.log(currentRank);

      let newRank = currentRank;

      if (direction === "up" && currentRank < 3) {
        newRank = currentRank + 1;
      } else if (direction === "down" && currentRank > 1) {
        newRank = currentRank - 1;
      } else {
        return;
      }

      await ApiService.assignRankToUser(userId, smartHomeId, newRank);

      const response = await ApiService.getUsersBySelectedSmartHome();
      setUsers(response);
      toast.success("Successfully assignRank!");
    } catch (error) {
      console.log(
        "Error assigning rank: ",
        error.response ? error.response.data : error.message
      );
    }
  };

  const sortedUsers = users.sort((a, b) => {
    // leader is on the first place
    if (a.isLeader) return -1;
    if (b.isLeader) return 1;

    //after leader Level 3 then Level 2
    if (a.rank === "Level 3" && b.rank !== "Level 3") return -1;
    if (a.rank !== "Level 3" && b.rank === "Level 3") return 1;

    if (a.rank === "Level 2" && b.rank !== "Level 2") return -1;
    if (a.rank !== "Level 2" && b.rank === "Level 2") return 1;

    // abc order
    return a.name.localeCompare(b.name);
  });

  //console.log(sortedUsers);
  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>Team</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.tableContainer}>
            {" "}
            {/* scrollable */}
            <table className={styles.table}>
              <thead>
                <tr>
                  <td>Users</td>
                  <td>Status</td>
                  <td>Leader</td>
                  <td>Email</td>
                  <td>Last login</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    /*className={
                      user.id === selectedUserId ? styles.selectedRow : ""
                    }*/
                  >
                    <td>
                      {user.name || "N/A"}
                      <span className={styles.greyTextLowSize}>
                        {user.rank || "N/A"}
                      </span>
                      {user.id === currentUserId && (
                        <span className={styles.orangeTextLowSize}>
                          Its you
                        </span>
                      )}
                    </td>

                    <td
                      className={
                        user.status === "Online"
                          ? styles.TextGreen
                          : styles.TextRed
                      }
                    >
                      {user.status || "N/A"}
                    </td>
                    <td className={styles.isLeaderText}>
                      {user.isLeader ? "Leader" : "-" || "N/A"}
                    </td>
                    <td className={styles.greyText}>{user.email || "N/A"}</td>
                    <td>
                      {user.lastLogin
                        ? new Date(user.lastLogin)
                            .toLocaleString("en-GB", {
                              timeZone: "Europe/Budapest",
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                            .replace(",", "")
                        : "N/A"}
                    </td>
                    <td>
                      {currentUserIsLeader && user.id !== currentUserId ? ( // Only render for leaders and exclude current user
                        <>
                          <FaRegTrashAlt
                            size={20}
                            className={classNames(
                              styles.deleteIconStyle,
                              styles.actionIconStyle
                            )}
                            onClick={() => handleRemoveUser(user.id)}
                          />
                          <FaArrowUp
                            size={20}
                            className={styles.actionIconStyle}
                            onClick={() => assignRank(user.id, "up")}
                          />
                          <FaArrowDown
                            size={20}
                            className={styles.actionIconStyle}
                            onClick={() => assignRank(user.id, "down")}
                          />
                        </>
                      ) : (
                        <p className={styles.TextRed}>-</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedUserId && <button className={styles.rankButton}>Rank</button>}
      </div>

      <div className={styles.addButtonContainer}>
        {!searchMode ? (
          <FaPlusCircle
            size={40}
            className={styles.addIcon}
            onClick={() => setSearchMode(true)}
          />
        ) : (
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search user by name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.addExtra}>
              <div className={styles.searchResults}>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className={styles.searchResultItem}
                    onClick={() => handleAddUser(result.id)}
                  >
                    {result.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Team;
