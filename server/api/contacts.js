import http from "../utils/http.js";
import { HS_API_URL } from "../constants.js";

export const getContact = async (sessionID) => {
  try {
    console.log(
      `===> request.get('${HS_API_URL}/contacts/v1/lists/all/contacts/all?count=1')`
    );
    const { data } = await http.get(
      sessionID,
      `${HS_API_URL}/contacts/v1/lists/all/contacts/all?count=1`
    );

    return data.contacts[0];
  } catch (e) {
    console.log(e);
    return JSON.parse(e.response.body);
  }
};
