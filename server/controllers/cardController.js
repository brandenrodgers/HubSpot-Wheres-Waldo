import express from "express";
import pgDB, { buildUniqueUserId } from "../utils/postgresDB.js";
import { moveWaldo } from "../utils/waldo.js";
import { validateHubSpotSignature } from "../utils/validateSignature.js";

const router = new express.Router();

router.get("/waldo", async (req, res) => {
  const { portalId, is_waldo_hiding_here, firstname, userId } = req.query;

  const isWaldoHere = is_waldo_hiding_here === "true";
  const properties = [];
  const actions = [];
  const baseUrl = await pgDB.getUrl();

  if (isWaldoHere) {
    actions.push({
      type: "ACTION_HOOK",
      httpMethod: "GET",
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
      httpMethod: "GET",
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

router.get("/found-waldo", async (req, res) => {
  const { portalId, userId, userEmail } = req.query;

  const isValidRequest = await validateHubSpotSignature(req);

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

router.get("/show-on-leaderboard", async (req, res) => {
  const { portalId, userId, userEmail, value } = req.query;

  const isValidRequest = await validateHubSpotSignature(req);

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
