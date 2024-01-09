import { getContacts, getContactWithWaldo } from "../api/contacts.js";
import {
  createPropertyForObject,
  getPropertyForObject,
  updatePropertyForObject,
} from "../api/properties.js";
import { IS_WALDO_HIDING_HERE_OPTIONS } from "../constants.js";

const getRandomNum = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const ensureWaldoProperty = async (auth) => {
  try {
    const property = await getPropertyForObject(
      auth,
      "contacts",
      IS_WALDO_HIDING_HERE_OPTIONS.name
    );

    if (property) {
      return;
    }
  } catch (e) {
    console.log("Waldo property does not exist");
  }

  try {
    await createPropertyForObject(
      auth,
      "contacts",
      IS_WALDO_HIDING_HERE_OPTIONS
    );
  } catch (e) {
    console.error("Failed to ensure waldo property", e);
    throw e;
  }
};

export const hideWaldo = async (auth) => {
  try {
    const contacts = await getContacts(auth);
    const randomIndex = getRandomNum(0, contacts.length - 1);
    const contact = contacts[randomIndex];

    await updatePropertyForObject(auth, "contacts", contact.vid, {
      [IS_WALDO_HIDING_HERE_OPTIONS.name]: true,
    });
  } catch (e) {
    console.error("Failed to hide waldo", e);
    throw e;
  }
};

export const moveWaldo = async (auth) => {
  try {
    const contact = await getContactWithWaldo(auth);

    await updatePropertyForObject(auth, "contacts", contact.id, {
      [IS_WALDO_HIDING_HERE_OPTIONS.name]: false,
    });
  } catch (e) {
    console.error("Failed to move waldo", e);
    throw e;
  }

  await hideWaldo(auth);
};
