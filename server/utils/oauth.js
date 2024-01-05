import NodeCache from "node-cache";
import { fetchAccessAndRefreshTokens } from "../api/oauth.js";
import {
  HS_APP_URL,
  HS_CLIENT_ID,
  HS_CLIENT_SECRET,
  SCOPES,
  BASE_URL,
} from "../constants.js";

const refreshTokenStore = {};
const accessTokenCache = new NodeCache({ deleteOnExpire: true });
let APP_BASE_URL = BASE_URL;

export const setBaseUrl = (url) => {
  APP_BASE_URL = url;
};

export const getRedirectUri = () => {
  return `${APP_BASE_URL}/oauth/callback`;
};

export const getAuthUrl = () => {
  return (
    `${HS_APP_URL}/oauth/authorize` +
    `?client_id=${encodeURIComponent(HS_CLIENT_ID)}` + // app's client ID
    `&redirect_uri=${getRedirectUri()}` + // where to send the user after the consent page
    `&scope=${encodeURIComponent(SCOPES)}` // scopes being requested by the app
  );
};

export const getAuthCodeProof = (authCode) => {
  return {
    grant_type: "authorization_code",
    client_id: HS_CLIENT_ID,
    client_secret: HS_CLIENT_SECRET,
    redirect_uri: getRedirectUri(),
    code: authCode,
  };
};

export const exchangeForTokens = async (userId, exchangeProof) => {
  console.log(exchangeProof);
  const tokens = await fetchAccessAndRefreshTokens(exchangeProof);

  refreshTokenStore[userId] = tokens.refresh_token;
  accessTokenCache.set(
    userId,
    tokens.access_token,
    Math.round(tokens.expires_in * 0.75)
  );

  console.log(
    `Received an access token (${tokens.access_token}) and refresh token (${tokens.refresh_token})`
  );
  return tokens.access_token;
};

const refreshAccessToken = async (userId) => {
  const refreshTokenProof = {
    grant_type: "refresh_token",
    client_id: HS_CLIENT_ID,
    client_secret: HS_CLIENT_SECRET,
    redirect_uri: getRedirectUri(),
    refresh_token: refreshTokenStore[userId],
  };
  return await exchangeForTokens(userId, refreshTokenProof);
};

export const getAccessToken = async (userId) => {
  // If the access token has expired, retrieve
  // a new one using the refresh token
  if (!accessTokenCache.get(userId)) {
    console.log("Refreshing expired access token");
    await refreshAccessToken(userId);
  }
  return accessTokenCache.get(userId);
};

export const isAuthorized = (userId) => {
  return refreshTokenStore[userId] ? true : false;
};
