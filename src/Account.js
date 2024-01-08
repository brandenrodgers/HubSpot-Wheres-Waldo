import axios from "axios";
import React, { useEffect, useState } from "react";
import Contacts from "./Contacts";

const Account = ({ updateUser, user }) => {
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

  const togglePrivate = async () => {
    try {
      const { data } = await axios.post("/api/user-settings", {
        public: !user.public,
      });
      updateUser(data);
    } catch (e) {
      console.log(e);
    }
  };

  const renderAuthStatus = () => {
    if (accessToken) {
      return (
        <div>
          <div>Hi {user.username}, you have installed the HubSpot app!</div>
          <div>Access Token:</div>
          <div style={{ fontSize: "7px" }}>{accessToken}</div>
          <Contacts />
        </div>
      );
    }
    return (
      <div>
        <div>
          Hi {user.username}, you need to install the HubSpot App{" "}
          <a href="oauth/install">(Install)</a>
        </div>
        <input type="button" onClick={fetchAccessToken} value="Retry fetch" />
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading Access Token For Session...</div>;
  }

  return (
    <div>
      <h2>Hi {user.username}</h2>
      <input
        type="button"
        onClick={togglePrivate}
        value={user.public ? "Make private" : "Make public"}
      />
      {renderAuthStatus()}
    </div>
  );
};

export default Account;
