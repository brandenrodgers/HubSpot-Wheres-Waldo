import "./config.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import ngrok from "ngrok";
import { getRedirectUri, setBaseUrl } from "./utils/oauth.js";
import oauthController from "./controllers/oauthController.js";
import cardController from "./controllers/cardController.js";
import {
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
app.use(express.static("public"));

// Use a session to keep track of client ID
app.use(
  session({
    secret: Math.random().toString(36).substring(2),
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/oauth", oauthController);
app.use("/card", cardController);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

const releaseConnections = (server) => {
  return server.close(() => {
    console.log("Process terminated");
    process.exit();
  });
};

(async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
      return new Promise((resolve) => setTimeout(resolve, 100))
        .then(() =>
          ngrok.connect({
            addr: PORT,
            authtoken: NGROK_AUTHTOKEN,
          })
        )
        .then((url) => {
          console.log(`Use ${url} to connect to this application.`);
          setBaseUrl(url);
          console.log(
            `Update your app to use ${getRedirectUri()} as Redirect URL.`
          );
          console.log(`Update your app's CRM data fetch url`);
        })
        .catch(async (e) => {
          console.log("Error during app start. ", e);
          return releaseConnections(server);
        });
    });

    process.on("SIGTERM", () => releaseConnections(server));
  } catch (e) {
    console.error("Error during app start. ", e);
  }
})();
