import "./styles.css";
import React, { useState } from "react";
import Header from "./Header";
import Login from "./Login";
import Account from "./Account";
import Flex from "./UIComponents/Flex";
import Leaderboard from "./Leaderboard";

const App = () => {
  const [user, setUser] = useState(null);

  const renderAccount = () => {
    if (!user) {
      return <Login onLogin={(user) => setUser(user)} />;
    }
    return <Account updateUser={setUser} user={user} />;
  };

  return (
    <div className="app">
      <Header />
      <Flex className="content" justify="center">
        {renderAccount()}
      </Flex>
      <Leaderboard />
    </div>
  );
};

export default App;
