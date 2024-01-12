import crypto from "crypto";
import pgDB from "./postgresDB.js";
import { HS_CLIENT_SECRET } from "../constants.js";

export const validateHubSpotSignature = async (req) => {
  const hubspotSignature = req.headers["x-hubspot-signature-v3"];
  const hubspotRequestTimestamp = req.headers["x-hubspot-request-timestamp"];

  const FIVE_MINUTES = 5 * 60 * 1000;
  if (Date.now() - hubspotRequestTimestamp > FIVE_MINUTES) {
    return false;
  }

  const baseUrl = await pgDB.getUrl();
  const requestUri = baseUrl + req.originalUrl;

  let requestInfo;

  if (req.method === "POST" && !!req.body) {
    requestInfo = `${req.method}${requestUri}${JSON.stringify(
      req.body
    )}${hubspotRequestTimestamp}`;
  } else {
    requestInfo = `${req.method}${requestUri}${hubspotRequestTimestamp}`;
  }

  const decodedString = decodeURIComponent(requestInfo);
  console.log(decodedString.replace("+", "%2B"));
  const recodedString = decodedString.replace("+", "%2B");

  const hash = crypto
    .createHmac("sha256", HS_CLIENT_SECRET)
    .update(recodedString)
    .digest("base64");

  return hash === hubspotSignature;
};
