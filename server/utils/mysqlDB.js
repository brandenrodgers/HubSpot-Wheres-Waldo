import util from "util";
import mysql from "mysql";

let connection = null;

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;

const HUBSPOT_TOKENS_TABLE_INIT = `create table if not exists hubspot_tokens  (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  refresh_token  VARCHAR(255)   default null,
  access_token   VARCHAR(255)   default null,
  hub_id         int            default null,
  expires_in     bigint         default null,
  created_at     datetime       default CURRENT_TIMESTAMP,
  updated_at     datetime       default CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);`;

const USERS_TABLE_INIT = `create table if not exists users  (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) default null,
  score int default 0,
  public boolean default false
);`;

const URLS_TABLE_INIT = `create table if not exists urls  (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) default null
);`;

const runQuery = (sql) => {
  console.log(sql);
  return !connection
    ? new Promise.reject(new Error("MYSQL DB not initialized!"))
    : connection.queryAsync(sql);
};

export default {
  init: async () => {
    try {
      connection = new mysql.createConnection({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
      });

      connection.connectAsync = util.promisify(connection.connect);
      connection.queryAsync = util.promisify(connection.query);

      console.log("connecting to MYSQL DB");
      await connection.connectAsync();

      console.log("initialize tables");
      await connection.queryAsync(URLS_TABLE_INIT);
      await connection.queryAsync(USERS_TABLE_INIT);
      await connection.queryAsync(HUBSPOT_TOKENS_TABLE_INIT);
    } catch (e) {
      console.error("DB is not available");
      console.error(e);
      throw e;
    }
  },
  close: () => {
    if (connection) {
      connection.end();
    }
  },
  saveUser: ({ username, password }) => {
    const saveUser = `insert into users (username, password) values ("${username}", "${password}")`;
    return runQuery(saveUser);
  },
  getUser: async ({ username, password }) => {
    const getUser = `select * from users where username = "${username}" and password = "${password}"`;
    const result = await runQuery(getUser);
    return result[0];
  },
  getUserByPortal: async (hub_id) => {
    const getTokenData = `select * from hubspot_tokens where hub_id = ${hub_id}`;
    const result = await runQuery(getTokenData);
    const tokenData = result[0];

    const getUser = `select * from users where id = ${tokenData.user_id}`;
    const result2 = await runQuery(getUser);
    return result2[0];
  },
  updateUserPublic: async (user_id, isPublic) => {
    const updateUser = `update users set public = '${isPublic}' where id = ${user_id}`;
    const getUser = `select * from users where id = ${user_id}`;

    await runQuery(updateUser);
    const result = await runQuery(getUser);
    return result[0];
  },
  updateUserScore: async (user_id, score) => {
    const updateUser = `update users set score = ${score} where id = ${user_id}`;
    const getUser = `select * from users where id = ${user_id}`;

    await runQuery(updateUser);
    const result = await runQuery(getUser);
    return result[0];
  },
  getPublicUsers: async () => {
    const getPublicUsers = `select * from users where public = true`;
    return runQuery(getPublicUsers);
  },
  getHubspotTokenData: async (user_id) => {
    const getHubspotTokenData = `select * from hubspot_tokens where user_id = "${user_id}"`;
    const result = await runQuery(getHubspotTokenData);
    return result[0];
  },
  saveHubspotTokenData: (
    { refresh_token, access_token, expires_in, hub_id },
    user_id
  ) => {
    const saveHubspotTokens = `insert into hubspot_tokens (user_id, refresh_token, access_token, hub_id, expires_in) values ("${user_id}", "${refresh_token}", "${access_token}", ${hub_id}, ${expires_in})`;
    return runQuery(saveHubspotTokens);
  },
  updateHubspotTokenData: async ({
    refresh_token,
    access_token,
    expires_in,
  } = {}) => {
    const updateHubspotTokenData = `update hubspot_tokens set access_token = '${access_token}', expires_in = '${expires_in}', updated_at = CURRENT_TIMESTAMP where refresh_token = "${refresh_token}"`;
    const getHubspotTokenData = `select * from hubspot_tokens where refresh_token = "${refresh_token}"`;

    await runQuery(updateHubspotTokenData);
    const result = await runQuery(getHubspotTokenData);
    return result[0];
  },
  getUrl: async () => {
    const getUrl = `select * from urls ORDER BY id DESC limit 1`;
    const result = await runQuery(getUrl);
    return result[0].url;
  },
  saveUrl: (url) => {
    const saveUrl = `insert into urls (url) values ("${url}")`;
    return runQuery(saveUrl);
  },
};
