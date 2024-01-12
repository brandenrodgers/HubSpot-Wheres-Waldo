import pg from "pg";
const { Client } = pg;

let client = null;

const PG_DB_HOST = process.env.PG_DB_HOST;
const PG_DB_USER = process.env.PG_DB_USER;
const PG_DB_NAME = process.env.PG_DB_NAME;
const PG_DB_PASSWORD = process.env.PG_DB_PASSWORD;

const HUBSPOT_TOKENS_TABLE_INIT = `CREATE TABLE IF NOT EXISTS hubspot_tokens (
  id SERIAL NOT NULL PRIMARY KEY,
  refresh_token  VARCHAR(255)   DEFAULT NULL,
  access_token   VARCHAR(255)   DEFAULT NULL,
  portal_id      INT            DEFAULT NULL,
  expires_in     BIGINT         DEFAULT NULL,
  created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);`;

const USERS_TABLE_INIT = `CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NULL,
  score INT DEFAULT 0,
  show_on_leaderboard BOOLEAN DEFAULT false
);`;

const URLS_TABLE_INIT = `CREATE TABLE IF NOT EXISTS urls (
  id  SERIAL NOT NULL PRIMARY KEY,
  url VARCHAR(255) DEFAULT NULL
);`;

const runQuery = (sql) => {
  return !client
    ? new Promise(new Error("MYSQL DB not initialized!")).reject()
    : client.query(sql);
};

export const buildUniqueUserId = (portalId, userId) => `${portalId}:${userId}`;

const pgDB = {
  init: async () => {
    try {
      client = new Client({
        host: PG_DB_HOST,
        user: PG_DB_USER,
        password: PG_DB_PASSWORD,
        database: PG_DB_NAME,
        port: 5432,
        ssl:
          process.env.NODE_ENV === "production"
            ? { sslmode: "require", rejectUnauthorized: false }
            : false,
      });

      await client.connect();

      await client.query(USERS_TABLE_INIT);
      await client.query(HUBSPOT_TOKENS_TABLE_INIT);
      await client.query(URLS_TABLE_INIT);
    } catch (e) {
      console.error("DB is not available", e);
      throw e;
    }
  },
  close: () => {
    if (client) {
      client.end();
    }
  },
  saveUser: async (id, userEmail) => {
    const saveUserQuery = {
      text: "INSERT INTO users(id, email) VALUES($1, $2) RETURNING *",
      values: [id, userEmail],
    };
    const res = await runQuery(saveUserQuery);
    return res.rows[0];
  },
  getUserById: async (id) => {
    const getUserQuery = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };
    const res = await runQuery(getUserQuery);
    return res.rows[0];
  },
  getOrCreateUserById: async (id, userEmail) => {
    const user = await pgDB.getUserById(id);
    return user ? user : pgDB.saveUser(id, userEmail);
  },
  updateUserLeaderboardStatus: async (id, showOnLeaderboard) => {
    const updateUserQuery = {
      text: `UPDATE users SET show_on_leaderboard = $1 WHERE id = $2`,
      values: [showOnLeaderboard, id],
    };
    await runQuery(updateUserQuery);
  },
  updateUserScore: async (id, score) => {
    const updateUserQuery = {
      text: "update users set score = $1 WHERE id = $2",
      values: [score, id],
    };
    await runQuery(updateUserQuery);
  },
  getLeaderboardUsers: async () => {
    const getLeaderboardUsersQuery =
      "SELECT * FROM users WHERE show_on_leaderboard = true";
    const res = await runQuery(getLeaderboardUsersQuery);
    return res.rows;
  },
  getHubspotTokenDataByPortalId: async (portalId) => {
    const getHubspotTokenDataQuery = {
      text: "SELECT * FROM hubspot_tokens WHERE portal_id = $1",
      values: [portalId],
    };
    const res = await runQuery(getHubspotTokenDataQuery);
    return res.rows[0];
  },
  saveHubspotTokenData: async (
    portalId,
    { refresh_token, access_token, expires_in }
  ) => {
    const saveHubspotTokensQuery = {
      text: "INSERT INTO hubspot_tokens(refresh_token, access_token, portal_id, expires_in) VALUES($1, $2, $3, $4)",
      values: [refresh_token, access_token, portalId, expires_in],
    };
    await runQuery(saveHubspotTokensQuery);
  },
  updateHubspotTokenData: async (
    old_refresh_token,
    { refresh_token, access_token, expires_in } = {}
  ) => {
    const updateHubspotTokenDataQuery = {
      text: "UPDATE hubspot_tokens SET access_token = $1, expires_in = $2, refresh_token = $3, updated_at = CURRENT_TIMESTAMP WHERE refresh_token = $4",
      values: [access_token, expires_in, refresh_token, old_refresh_token],
    };
    const getHubspotTokenDataQuery = {
      text: "SELECT * from hubspot_tokens WHERE refresh_token = $1",
      values: [refresh_token],
    };

    await runQuery(updateHubspotTokenDataQuery);
    const res = await runQuery(getHubspotTokenDataQuery);
    return res.rows[0];
  },
  getUrl: async () => {
    const getUrlQuery = "SELECT * FROM urls ORDER BY id DESC limit 1";
    const res = await runQuery(getUrlQuery);
    return res.rows[0].url;
  },
  saveUrl: async (url) => {
    const saveUrlQuery = {
      text: "INSERT INTO urls(url) VALUES($1) RETURNING *",
      values: [url],
    };
    const res = await runQuery(saveUrlQuery);
    return res.rows[0];
  },
};

export default pgDB;
