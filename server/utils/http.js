import axios from "axios";
import NodeCache from "node-cache";
import { getAccessToken } from "./oauth.js";

// Each session is saved for a day
export const userSessionStore = new NodeCache({
  deleteOnExpire: true,
  stdTTL: 86400,
});

export const getUserForSession = ({ sessionID }) => {
  const userId = userSessionStore.get(sessionID);
  if (!userId) {
    throw new Error("Unable to locate sessionID");
  }
  return userId;
};

const getHeaders = async (auth = {}) => {
  const userId = auth.userId || getUserForSession(auth);
  const accessToken = await getAccessToken(userId);
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

const getRequest = async (auth, url) => {
  const headers = await getHeaders(auth);
  return axios({ method: "get", headers, url });
};

const postRequest = async (auth, url, data) => {
  const headers = await getHeaders(auth);
  return axios({ method: "post", headers, url, data });
};

const patchRequest = async (auth, url, data) => {
  const headers = await getHeaders(auth);
  return axios({ method: "patch", headers, url, data });
};

export default {
  get: getRequest,
  post: postRequest,
  patch: patchRequest,
};
