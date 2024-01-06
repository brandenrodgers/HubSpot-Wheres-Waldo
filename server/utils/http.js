import axios from "axios";
import { getAccessToken } from "./oauth.js";

const getHeaders = async () => {
  // TODO: fix this eventually
  const accessToken = await getAccessToken(1);
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

const getRequest = async (url) => {
  const headers = await getHeaders();
  return axios({ method: "get", headers, url });
};

export default {
  get: getRequest,
};
