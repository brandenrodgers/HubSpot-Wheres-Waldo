import express from "express";
import crypto from "crypto";
import pgDB, { buildUniqueUserId } from "../utils/postgresDB.js";
import { moveWaldo } from "../utils/waldo.js";
import { HS_CLIENT_SECRET } from "../constants.js";

const router = new express.Router();

// const validateHubSpotSignature = async (req) => {
//   const baseUrl = await pgDB.getUrl();
//   const hubspotSignature = req.headers["x-hubspot-signature"];

//   const fullUrl = baseUrl + req.originalUrl;
//   const validateKey =
//     HS_CLIENT_SECRET + req.method + fullUrl + JSON.stringify(req.body);
//   const hash = crypto.createHash("sha256").update(validateKey).digest("hex");
//   console.log({ hubspotSignature, validateKey, hash });

//   // TODO Actually validate request
//   return true;
// };

const validateHubSpotSignatureV3 = async (req) => {
  console.log(req);
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

  console.log("V3", { hubspotSignature, recodedString, requestInfo, hash });

  return hash === hubspotSignature;
};

router.get("/waldo", async (req, res) => {
  const { portalId, is_waldo_hiding_here, firstname, userId } = req.query;

  const isWaldoHere = is_waldo_hiding_here === "true";
  const properties = [];
  const actions = [];
  const baseUrl = await pgDB.getUrl();

  if (isWaldoHere) {
    actions.push({
      type: "ACTION_HOOK",
      httpMethod: "POST",
      uri: `${baseUrl}/card/found-waldo`,
      label: "Mark Waldo as found",
    });
  } else {
    properties.push({
      label: "Clue",
      dataType: "STRING",
      value: "He is somewhere else...",
    });
  }

  const user = pgDB.getUserById(buildUniqueUserId(portalId, userId));

  if (user) {
    actions.push({
      type: "ACTION_HOOK",
      httpMethod: "POST",
      uri: `${baseUrl}/card/show-on-leaderboard?value=${!user.show_on_leaderboard}`,
      label: user.show_on_leaderboard
        ? "Leave leaderboard"
        : "Join leaderboard",
    });
  }

  res.send({
    results: [
      {
        objectId: 123,
        title: "Where's Waldo",
        waldo: isWaldoHere
          ? "YOU FOUND HIM!"
          : `He's not hiding with ${firstname}!`,
        properties,
        actions,
      },
    ],
  });
});

router.post("/found-waldo", async (req, res) => {
  const { portalId, userId, userEmail } = req.body;

  const isValidRequest = await validateHubSpotSignatureV3(req);

  if (!isValidRequest) {
    return res.sendStatus(401);
  }

  const user = await pgDB.getOrCreateUserById(
    buildUniqueUserId(portalId, userId),
    userEmail
  );

  await pgDB.updateUserScore(user.id, user.score + 1);

  try {
    await moveWaldo(portalId);
  } catch (e) {
    return res.sendStatus(500);
  }

  res.sendStatus(200);
});

router.post("/show-on-leaderboard", async (req, res) => {
  const { portalId, userId, userEmail } = req.body;
  const { value } = req.query;

  const isValidRequest = await validateHubSpotSignatureV3(req);

  if (!isValidRequest) {
    return res.sendStatus(401);
  }

  const user = await pgDB.getOrCreateUserById(
    buildUniqueUserId(portalId, userId),
    userEmail
  );

  await pgDB.updateUserLeaderboardStatus(user.id, value);

  res.sendStatus(200);
});

export default router;
