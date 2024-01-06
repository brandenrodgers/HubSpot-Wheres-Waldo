import mysqlDB from "./mysqlDB.js";
import { fetchAccessAndRefreshTokens } from "../api/oauth.js";
import {
  HS_APP_URL,
  HS_CLIENT_ID,
  HS_CLIENT_SECRET,
  SCOPES,
} from "../constants.js";

const getRedirectUri = async () => {
  const baseUrl = await mysqlDB.getUrl();
  return `${baseUrl}/oauth/callback`;
};

export const getAuthUrl = async (state) => {
  const redirectUri = await getRedirectUri();
  return (
    `${HS_APP_URL}/oauth/authorize` +
    `?client_id=${encodeURIComponent(HS_CLIENT_ID)}` + // app's client ID
    `&redirect_uri=${redirectUri}` + // where to send the user after the consent page
    `&scope=${encodeURIComponent(SCOPES)}` + // scopes being requested by the app
    `${state ? `&state=${state}` : ""}` // state that will be passed back to the redirect url
  );
};

export const getAuthCodeProof = async (authCode) => {
  const redirectUri = await getRedirectUri();
  return {
    grant_type: "authorization_code",
    client_id: HS_CLIENT_ID,
    client_secret: HS_CLIENT_SECRET,
    redirect_uri: redirectUri,
    code: authCode,
  };
};

const refreshAccessToken = async (userId) => {
  const redirectUri = await getRedirectUri();
  const staleTokenData = await mysqlDB.getHubspotTokenData(userId);

  const refreshTokenProof = {
    grant_type: "refresh_token",
    client_id: HS_CLIENT_ID,
    client_secret: HS_CLIENT_SECRET,
    redirect_uri: redirectUri,
    refresh_token: staleTokenData.refresh_token,
  };

  const tokenData = await fetchAccessAndRefreshTokens(refreshTokenProof);
  await mysqlDB.updateHubspotTokenData(tokenData);
};

export const getAccessToken = async (userId) => {
  const tokenExpired = await verifyTokenExpiration(userId);

  if (tokenExpired) {
    console.log("Refreshing expired access token");
    await refreshAccessToken(userId);
  }

  const tokenData = await mysqlDB.getHubspotTokenData(userId);
  return tokenData.access_token;
};

export const verifyTokenExpiration = async (userId) => {
  const tokenData = await mysqlDB.getHubspotTokenData(userId);
  return (
    Date.now() >=
    new Date(tokenData.updated_at).getTime() + tokenData.expires_in * 1000
  );
};

export const verifyAuthorization = async () => {
  const tokenData = await mysqlDB.getHubspotTokenData();
  return !!tokenData && Object.keys(tokenData).length();
};
