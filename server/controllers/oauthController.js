import express from "express";
import pgDB from "../utils/postgresDB.js";
import { getAuthUrl, getAuthCodeProof } from "../utils/oauth.js";
import {
  fetchAccessAndRefreshTokens,
  fetchAccessTokenMetadata,
} from "../api/oauth.js";
import { ensureWaldoProperty, hideWaldo } from "../utils/waldo.js";

const router = new express.Router();

// Redirect the user from the installation page to the authorization URL
router.get("/install", async (req, res) => {
  const authUrl = await getAuthUrl();
  res.redirect(authUrl);
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

    const portalId = tokenMetadata.hub_id;

    await pgDB.saveHubspotTokenData(portalId, tokenData);

    // Ensure custom waldo property exists
    await ensureWaldoProperty(portalId);

    // Hide waldo on a random contact
    await hideWaldo(portalId);

    res.redirect(`/`);
  }
});

export default router;
