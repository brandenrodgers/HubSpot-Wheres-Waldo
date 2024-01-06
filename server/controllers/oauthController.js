import express from "express";
import mysqlDB from "../utils/mysqlDB.js";
import { fetchAccessAndRefreshTokens } from "../api/oauth.js";
import {
  getAuthUrl,
  getAuthCodeProof,
  getAccessToken,
} from "../utils/oauth.js";

const router = new express.Router();

// Redirect the user from the installation page to the authorization URL
router.get("/install", async (req, res) => {
  const authUrl = await getAuthUrl(req.query.userId);
  res.redirect(authUrl);
});

router.get("/install-status", async (req, res) => {
  try {
    const accessToken = await getAccessToken(req.query.userId);
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

    // State will be the user id of the logged-in user
    await mysqlDB.saveHubspotTokenData(tokenData, req.query.state);
    res.redirect(`/`);
  }
});

export default router;
