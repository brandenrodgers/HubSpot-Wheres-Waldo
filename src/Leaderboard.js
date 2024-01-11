import axios from "axios";
import React, { useEffect, useState } from "react";
import Flex from "./UIComponents/Flex";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get("/api/leaderboard");
      setLeaderboard(data.sort((a, b) => b.score - a.score));
    } catch (e) {
      console.log(e);
    }
  };

  const renderLeaderboardUser = (user, i) => {
    const portalId = user.id.split(":")[0];
    return (
      <div key={i} className="leaderboard-card">
        <div className="leaderboard-rank">#{i + 1}</div>
        <Flex align="baseline" gap="10px">
          <h3>{user.username || user.email}</h3>
          <span className="leaderboard-score">
            found Waldo {user.score} time{user.score === 1 ? "" : "s"} in (
            {portalId})
          </span>
        </Flex>
      </div>
    );
  };

  const renderLeaders = () => {
    return (
      <Flex className="w-100" direction="column" align="center">
        {leaderboard.map(renderLeaderboardUser)}
      </Flex>
    );
  };

  return (
    <Flex className="leaderboard" align="center" direction="column">
      <h1>Leaderboard</h1>
      <span className="p-bottom-10">
        Join the leaderbord by installing the app and using the dropdown action
        in the Where's Waldo CRM card!
      </span>
      {renderLeaders()}
    </Flex>
  );
};

export default Leaderboard;
