import axios from "axios";
import { getAccessToken } from "./oauth.js";

const getHeaders = async (sessionID) => {
  const accessToken = await getAccessToken(sessionID);
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

const getRequest = async (sessionID, url) => {
  const headers = await getHeaders(sessionID);
  return axios({ method: "get", headers, url });
};

export default {
  get: getRequest,
};
