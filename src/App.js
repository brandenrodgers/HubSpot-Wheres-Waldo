import "./styles.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Contacts from "./Contacts";
import Login from "./Login";

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAccessToken();
    }
  }, [user]);

  const fetchAccessToken = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/oauth/install-status`, {
        params: {
          userId: user.id,
        },
      });
      setAccessToken(data);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const renderContent = () => {
    if (!user) {
      return <Login onLogin={(user) => setUser(user)} />;
    }
    if (isLoading) {
      return <div>Loading Access Token For Session...</div>;
    }
    if (accessToken) {
      return (
        <div>
          <div>You have installed the HubSpot app!</div>{" "}
          <div>Access Token:</div>
          <div style={{ fontSize: "7px" }}>{accessToken}</div>
          <Contacts />
        </div>
      );
    }
    return (
      <div>
        <div>
          You need to install the HubSpot App{" "}
          <a href={`oauth/install?userId=${user.id}`}>(Install)</a>
        </div>
        <input type="button" onClick={fetchAccessToken} value="Retry fetch" />
      </div>
    );
  };

  return (
    <div className="app">
      <Header />
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default App;
