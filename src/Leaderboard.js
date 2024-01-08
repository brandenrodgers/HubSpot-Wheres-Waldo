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
      setLeaderboard(data);
    } catch (e) {
      console.log(e);
    }
  };

  const renderLeaders = () => {
    return (
      <ul>
        {leaderboard.map(({ username, score }, i) => (
          <li key={i}>
            {username}: {score}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Flex className="leaderboard" align="center" direction="column">
      <h1>Leaderboard</h1>
      <span>Make your account public to show up in the leaderboard</span>
      {renderLeaders()}
    </Flex>
  );
};

export default Leaderboard;
