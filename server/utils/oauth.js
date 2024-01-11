import pgDB from "./postgresDB.js";
import { fetchAccessAndRefreshTokens } from "../api/oauth.js";
import {
  HS_APP_URL,
  HS_CLIENT_ID,
  HS_CLIENT_SECRET,
  SCOPES,
} from "../constants.js";

const getRedirectUri = async () => {
  const baseUrl = await pgDB.getUrl();
  return `${baseUrl}/oauth/callback`;
};

export const getAuthUrl = async () => {
  const redirectUri = await getRedirectUri();
  return (
    `${HS_APP_URL}/oauth/authorize` +
    `?client_id=${encodeURIComponent(HS_CLIENT_ID)}` + // app's client ID
    `&redirect_uri=${redirectUri}` + // where to send the user after the consent page
    `&scope=${encodeURIComponent(SCOPES)}` // scopes being requested by the app
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

const refreshAccessToken = async (portalId) => {
  const redirectUri = await getRedirectUri();
  const staleTokenData = await pgDB.getHubspotTokenDataByPortalId(portalId);

  const refreshTokenProof = {
    grant_type: "refresh_token",
    client_id: HS_CLIENT_ID,
    client_secret: HS_CLIENT_SECRET,
    redirect_uri: redirectUri,
    refresh_token: staleTokenData.refresh_token,
  };

  const tokenData = await fetchAccessAndRefreshTokens(refreshTokenProof);
  await pgDB.updateHubspotTokenData(staleTokenData.refresh_token, tokenData);
};

export const getAccessToken = async (portalId) => {
  const tokenExpired = await verifyTokenExpiration(portalId);

  if (tokenExpired) {
    console.log("Refreshing expired access token");
    await refreshAccessToken(portalId);
  }

  const tokenData = await pgDB.getHubspotTokenDataByPortalId(portalId);
  return tokenData.access_token;
};

const verifyTokenExpiration = async (portalId) => {
  const tokenData = await pgDB.getHubspotTokenDataByPortalId(portalId);
  return (
    Date.now() >=
    new Date(tokenData.updated_at).getTime() + tokenData.expires_in * 1000
  );
};
