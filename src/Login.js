import axios from "axios";
import React, { useState } from "react";
import Flex from "./UIComponents/Flex";

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
    <Flex direction="column" align="center" gap="10px">
      <div>
        <span className="p-right">Username:</span>
        <input
          type="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <span className="p-right">Password:</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          className="m-right"
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
      </div>
      <div>{status}</div>
    </Flex>
  );
};

export default Login;
