import http from "../utils/http.js";
import { HS_API_URL } from "../constants.js";

// Contacts
export const getContacts = async (req) => {
  try {
    const { data } = await http.get(
      req,
      `${HS_API_URL}/contacts/v1/lists/all/contacts/all?count=1`
    );
    console.log(data.contacts);
    return data.contacts;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
