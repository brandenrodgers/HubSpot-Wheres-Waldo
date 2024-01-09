export const PORT = process.env.PORT || 3000;

export const BASE_URL = process.env.BASE_URL;

export const HS_QA = process.env.HS_ENV === "qa" ? "qa" : "";
export const HS_APP_URL = `https://app.hubspot${HS_QA}.com`;
export const HS_API_URL = `https://api.hubapi${HS_QA}.com`;

export const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN;

export const HS_CLIENT_ID = process.env.HS_CLIENT_ID;
export const HS_CLIENT_SECRET = process.env.HS_CLIENT_SECRET;
export const SCOPES = process.env.SCOPES
  ? process.env.SCOPES.split(/ |, ?|%20/).join(" ")
  : null;

export const IS_WALDO_HIDING_HERE_OPTIONS = {
  name: "is_waldo_hiding_here",
  label: "Is Waldo Hiding Here",
  groupName: "contactinformation",
  type: "bool",
  options: [
    { label: "Waldo is here", description: "Waldo is here", value: true },
    {
      label: "Waldo is not here",
      description: "Waldo is not here",
      value: false,
    },
  ],
};
