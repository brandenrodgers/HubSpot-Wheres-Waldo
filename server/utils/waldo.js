import { getContacts } from "../api/contacts.js";
import {
  createPropertyForObject,
  getPropertyForObject,
  updatePropertyForObject,
} from "../api/properties.js";

const getRandomNum = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const IS_WALDO_HIDING_HERE_OPTIONS = {
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

export const ensureWaldoProperty = async (req) => {
  try {
    const property = await getPropertyForObject(
      req,
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
      req,
      "contacts",
      IS_WALDO_HIDING_HERE_OPTIONS
    );
  } catch (e) {
    console.error("Failed to ensure waldo property", e);
    throw e;
  }
};

export const hideWaldo = async (req) => {
  try {
    const contacts = await getContacts(req);
    const randomIndex = getRandomNum(0, contacts.length - 1);
    const contact = contacts[randomIndex];

    await updatePropertyForObject(req, "contacts", contact.vid, {
      [IS_WALDO_HIDING_HERE_OPTIONS.name]: true,
    });
  } catch (e) {
    console.error("Failed to hide waldo", e);
    throw e;
  }
};
