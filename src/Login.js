import axios from "axios";
import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const signUpRequest = async () => {
    try {
      await axios.post("/api/sign-up", { username, password });
      setStatus("Successfully signed up. Please log in");
    } catch (e) {
      console.log(e);
      setStatus("Sign up failed. Please try again with a different username");
    }
  };

  const loginRequest = async () => {
    try {
      const { data } = await axios.get("/api/login", {
        params: {
          username,
          password,
        },
      });
      onLogin(data);
    } catch (e) {
      console.log(e);
      setStatus("Login failed. Please try again");
    }
  };

  return (
    <div>
      Username:
      <input
        type="input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      Password:
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="button"
        value="sign up"
        disabled={!username || !password}
        onClick={signUpRequest}
      />
      <input
        type="button"
        value="login"
        disabled={!username || !password}
        onClick={loginRequest}
      />
      <div>{status}</div>
    </div>
  );
};

export default Login;
