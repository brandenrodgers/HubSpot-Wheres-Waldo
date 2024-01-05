import express from "express";
import {
  exchangeForTokens,
  getAuthUrl,
  getAuthCodeProof,
  getAccessToken,
} from "../utils/oauth.js";

const router = new express.Router();

// Redirect the user from the installation page to the authorization URL
router.get("/install", (req, res) => {
  res.redirect(getAuthUrl());
});

router.get("/install-status", async (req, res) => {
  try {
    const accessToken = await getAccessToken(req.sessionID);
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
    const authCodeProof = getAuthCodeProof(req.query.code);
    console.log(
      "Exchanging authorization code for an access token and refresh token"
    );
    const token = await exchangeForTokens(req.sessionID, authCodeProof);
    if (token.message) {
      return res.redirect(`/error?msg=${token.message}`);
    }

    res.redirect(`/`);
  }
});

export default router;
