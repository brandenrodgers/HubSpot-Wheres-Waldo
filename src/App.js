import "./styles.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "./Header";

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAccessToken();
  }, []);

  const fetchAccessToken = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/oauth/install-status");
      setAccessToken(data);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading Access Token For Session...</div>;
    }
    if (accessToken) {
      return (
        <div>
          <div>You have installed the HubSpot app!</div>{" "}
          <div>Access Token: {accessToken}</div>
        </div>
      );
    }
    return (
      <div>
        <div>
          You need to install the HubSpot App{" "}
          <a href="oauth/install">(Install)</a>
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
