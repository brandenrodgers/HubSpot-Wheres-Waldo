import "./config.js";
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import ngrok from "ngrok";
import pgDB from "./utils/postgresDB.js";
import oauthController from "./controllers/oauthController.js";
import cardController from "./controllers/cardController.js";
import apiController from "./controllers/apiController.js";
import {
  BASE_URL,
  HS_CLIENT_ID,
  HS_CLIENT_SECRET,
  NGROK_AUTHTOKEN,
  PORT,
  SCOPES,
} from "./constants.js";

if (!HS_CLIENT_ID || !HS_CLIENT_SECRET || !SCOPES) {
  throw new Error(
    "Missing HS_CLIENT_ID or HS_CLIENT_SECRET or SCOPES environment variables."
  );
}

const app = express();

// add middleware
app.use(
  session({
    secret: Math.random().toString(36).substring(2),
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static("public"));

app.use("/oauth", oauthController);
app.use("/card", cardController);
app.use("/api", apiController);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

const releaseConnections = (server) => {
  pgDB.close();
  return server.close(() => {
    console.log("Process terminated");
    process.exit();
  });
};

(async () => {
  try {
    await pgDB.init();

    const server = app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);

      // Only use ngrok if running locally
      if (BASE_URL) {
        console.log(`Use ${BASE_URL} to connect to this application.`);
        pgDB.saveUrl(BASE_URL);
      } else {
        return new Promise((resolve) => setTimeout(resolve, 100))
          .then(() =>
            ngrok.connect({
              addr: PORT,
              authtoken: NGROK_AUTHTOKEN,
            })
          )
          .then(async (url) => {
            console.log(`Use ${url} to connect to this application.`);
            pgDB.saveUrl(url);
          })
          .catch(async (e) => {
            console.log("Error during app start. ", e);
            return releaseConnections(server);
          });
      }
    });

    process.on("SIGTERM", () => releaseConnections(server));
  } catch (e) {
    console.error("Error during app start. ", e);
  }
})();
