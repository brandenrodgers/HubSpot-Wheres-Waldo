import http from "../utils/http.js";
import { HS_API_URL } from "../constants.js";

export const getContacts = async () => {
  try {
    const { data } = await http.get(
      `${HS_API_URL}/contacts/v1/lists/all/contacts/all?count=1`
    );
    return data.contacts;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};
