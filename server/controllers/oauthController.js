import express from "express";
import mysqlDB from "../utils/mysqlDB.js";
import { getUserForSession } from "../utils/http.js";
import {
  getAuthUrl,
  getAuthCodeProof,
  getAccessToken,
} from "../utils/oauth.js";
import {
  fetchAccessAndRefreshTokens,
  fetchAccessTokenMetadata,
} from "../api/oauth.js";
import { ensureWaldoProperty, hideWaldo } from "../utils/waldo.js";

const router = new express.Router();

// Redirect the user from the installation page to the authorization URL
router.get("/install", async (req, res) => {
  let userId;
  try {
    userId = getUserForSession(req);
  } catch (e) {
    res.sendStatus(500);
  }
  const authUrl = await getAuthUrl(userId);
  res.redirect(authUrl);
});

router.get("/install-status", async (req, res) => {
  try {
    const userId = getUserForSession(req);
    const accessToken = await getAccessToken(userId);
    res.send(accessToken);
  } catch (e) {
    console.log("no access token found");
    res.sendStatus(400);
  }
});

router.get("/callback", async (req, res) => {
  // Received a user authorization code, so now combine that with the other
  // required values and exchange both for an access token and a refresh token
  if (req.query.code) {
    const authCodeProof = await getAuthCodeProof(req.query.code);
    const tokenData = await fetchAccessAndRefreshTokens(authCodeProof);

    if (tokenData.message) {
      return res.redirect(`/error?msg=${tokenData.message}`);
    }

    // Get the hub_id associated with the access token
    const tokenMetadata = await fetchAccessTokenMetadata(
      tokenData.access_token
    );

    console.log(tokenMetadata);

    // "State" will be the user id of the logged-in user
    await mysqlDB.saveHubspotTokenData(
      { hub_id: tokenMetadata.hub_id, ...tokenData },
      req.query.state
    );

    // Ensure custom waldo property exists
    await ensureWaldoProperty(req);

    // Hide waldo on a random contact
    await hideWaldo(req);

    res.redirect(`/`);
  }
});

export default router;
