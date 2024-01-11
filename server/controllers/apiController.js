import express from "express";
import pgDB from "../utils/postgresDB.js";

const router = new express.Router();

router.use(express.json());

router.get("/leaderboard", async (req, res) => {
  const users = await pgDB.getLeaderboardUsers();
  if (users) {
    return res.send(users);
  }
  res.sendStatus(500);
});

export default router;
