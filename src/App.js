import "./styles.css";
import React from "react";
import Header from "./Header";
import InfoSection from "./InfoSection";
import Leaderboard from "./Leaderboard";
import Flex from "./UIComponents/Flex";

const App = () => {
  return (
    <Flex className="app" direction="column">
      <Header />
      <div className="content">
        <InfoSection />
        <Leaderboard />
      </div>
    </Flex>
  );
};

export default App;
