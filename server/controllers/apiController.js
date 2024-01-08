import express from "express";
import mysqlDB from "../utils/mysqlDB.js";
import { userSessionStore } from "../utils/http.js";
import { getContacts } from "../api/contacts.js";

const router = new express.Router();

router.use(express.json());

router.post("/sign-up", async (req, res) => {
  const { username, password } = req.body;
  try {
    await mysqlDB.saveUser({ username, password });
  } catch (e) {
    console.error(e.sqlMessage);
    return res.sendStatus(500);
  }
  res.sendStatus(200);
});

router.get("/login", async (req, res) => {
  const { username, password } = req.query;
  const user = await mysqlDB.getUser({ username, password });
  if (user) {
    userSessionStore.set(req.sessionID, user.id);
    return res.send(user);
  }
  res.sendStatus(404);
});

router.post("/user-settings", async (req, res) => {
  const { public: isPublic } = req.body;
  const userId = userSessionStore.get(req.sessionID);

  const user = await mysqlDB.updateUserPublic(userId, isPublic ? 1 : 0);
  if (user) {
    return res.send(user);
  }
  res.sendStatus(500);
});

router.get("/contacts", async (req, res) => {
  try {
    const contacts = await getContacts(req);
    res.send(contacts);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.get("/leaderboard", async (req, res) => {
  const users = await mysqlDB.getPublicUsers();
  if (users) {
    const scores = users.map((user) => ({
      username: user.username,
      score: user.score,
    }));
    return res.send(scores);
  }
  res.sendStatus(500);
});

export default router;
