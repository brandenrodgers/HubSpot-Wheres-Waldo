import http from "../utils/http.js";
import { HS_API_URL, IS_WALDO_HIDING_HERE_OPTIONS } from "../constants.js";

// Contacts
export const getContacts = async (auth) => {
  try {
    const { data } = await http.get(
      auth,
      `${HS_API_URL}/contacts/v1/lists/all/contacts/all`
    );
    return data.contacts;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getContactWithWaldo = async (auth) => {
  try {
    const { data } = await http.post(
      auth,
      `${HS_API_URL}/crm/v3/objects/contacts/search`,
      {
        filterGroups: [
          {
            filters: [
              {
                propertyName: IS_WALDO_HIDING_HERE_OPTIONS.name,
                operator: "EQ",
                value: "true",
              },
            ],
          },
        ],
      }
    );
    return data.results[0];
  } catch (e) {
    console.error(e);
    throw e;
  }
};
