import express from "express";
import crypto from "crypto";
import mysqlDB from "../utils/mysqlDB.js";
import { moveWaldo } from "../utils/waldo.js";
import { HS_CLIENT_SECRET } from "../constants.js";

const router = new express.Router();

router.get("/waldo", async (req, res) => {
  const { portalId, is_waldo_hiding_here, firstname } = req.query;

  const isWaldoHere = is_waldo_hiding_here === "true";
  const properties = [];
  const actions = [];

  if (isWaldoHere) {
    const baseUrl = await mysqlDB.getUrl();

    actions.push({
      type: "ACTION_HOOK",
      httpMethod: "POST",
      uri: `${baseUrl}/card/found-waldo?portalId=${portalId}`,
      label: "Mark Waldo as found",
    });
  } else {
    properties.push({
      label: "Clue",
      dataType: "STRING",
      value: "He is somewhere else...",
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
  const { portalId } = req.query;
  const hubspotSignature = req.headers["x-hubspot-signature"];

  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  const validateKey = HS_CLIENT_SECRET + req.method + fullUrl;
  const hash = crypto.createHash("sha256").update(validateKey).digest("hex");
  console.log({ hubspotSignature, validateKey, hash });

  // TODO Actually validate request

  const user = await mysqlDB.getUserByPortal(portalId);

  await mysqlDB.updateUserScore(user.id, user.score + 1);

  try {
    await moveWaldo({ userId: user.id });
  } catch (e) {
    return res.sendStatus(500);
  }

  res.sendStatus(200);
});

export default router;
