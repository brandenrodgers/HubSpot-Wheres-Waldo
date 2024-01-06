import express from "express";
import mysqlDB from "../utils/mysqlDB.js";
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
    return res.send(user);
  }
  res.sendStatus(404);
});

router.get("/contacts", async (req, res) => {
  try {
    const contacts = await getContacts();
    res.send(contacts);
  } catch (e) {
    res.sendStatus(500);
  }
});

export default router;
