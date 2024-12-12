"use client";
import Team from "../../ui/dashboard/team/team";
import styles from "../../ui/dashboard/dashboard.module.css";
import teamstyles from "../../ui/dashboard/team/team-level.module.css";
import { useState } from "react";

const TeamPage = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleSelect = (level) => {
    setSelectedLevel(level);
  };

  const getMessage = () => {
    switch (selectedLevel) {
      case "Level 1":
        return "On Level 1 you have the permission only to view.";

      case "Level 2":
        return "On Level 2 you have the permission to create and delete rooms.";
      case "Level 3":
        return "On Level 3 you have all permission.";
      default:
        return "";
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <Team></Team>
      </div>
      <div className={styles.side}>
        <div className={teamstyles.container}>
          <h2 className={teamstyles.title}>Rank description</h2>
          <div className={teamstyles.buttonContainer}>
            {["Level 1", "Level 2", "Level 3"].map((level) => (
              <button
                key={level}
                className={`${teamstyles.button} ${
                  selectedLevel === level ? teamstyles.selected : ""
                }`}
                onClick={() => handleSelect(level)}
              >
                {level}
              </button>
            ))}
          </div>
          <p className={teamstyles.message}>{getMessage()}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
