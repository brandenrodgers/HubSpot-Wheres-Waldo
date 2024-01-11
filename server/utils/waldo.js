import { getContacts, getContactWithWaldo } from "../api/contacts.js";
import {
  createPropertyForObject,
  getPropertyForObject,
  updatePropertyForObject,
} from "../api/properties.js";
import { IS_WALDO_HIDING_HERE_OPTIONS } from "../constants.js";

const getRandomNum = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const ensureWaldoProperty = async (portalId) => {
  try {
    const property = await getPropertyForObject(
      portalId,
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
      portalId,
      "contacts",
      IS_WALDO_HIDING_HERE_OPTIONS
    );
  } catch (e) {
    console.error("Failed to ensure waldo property", e);
    throw e;
  }
};

export const hideWaldo = async (portalId) => {
  try {
    const contacts = await getContacts(portalId);
    const randomIndex = getRandomNum(0, contacts.length - 1);
    const contact = contacts[randomIndex];

    await updatePropertyForObject(portalId, "contacts", contact.vid, {
      [IS_WALDO_HIDING_HERE_OPTIONS.name]: true,
    });
  } catch (e) {
    console.error("Failed to hide waldo", e);
    throw e;
  }
};

export const moveWaldo = async (portalId) => {
  try {
    const contact = await getContactWithWaldo(portalId);

    await updatePropertyForObject(portalId, "contacts", contact.id, {
      [IS_WALDO_HIDING_HERE_OPTIONS.name]: false,
    });
  } catch (e) {
    console.error("Failed to move waldo", e);
    throw e;
  }

  await hideWaldo(portalId);
};
