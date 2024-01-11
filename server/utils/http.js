import axios from "axios";
import { getAccessToken } from "./oauth.js";

const getHeaders = async (portalId) => {
  const accessToken = await getAccessToken(portalId);
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

const getRequest = async (portalId, url) => {
  const headers = await getHeaders(portalId);
  return axios({ method: "get", headers, url });
};

const postRequest = async (portalId, url, data) => {
  const headers = await getHeaders(portalId);
  return axios({ method: "post", headers, url, data });
};

const patchRequest = async (portalId, url, data) => {
  const headers = await getHeaders(portalId);
  return axios({ method: "patch", headers, url, data });
};

export default {
  get: getRequest,
  post: postRequest,
  patch: patchRequest,
};
