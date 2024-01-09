import http from "../utils/http.js";
import { HS_API_URL } from "../constants.js";

export const getPropertyForObject = async (auth, objectType, property) => {
  try {
    const { data } = await http.get(
      auth,
      `${HS_API_URL}/properties/v1/${objectType}/properties/named/${property}`
    );
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createPropertyForObject = async (
  auth,
  objectType,
  propertyOptions
) => {
  try {
    const { data } = await http.post(
      auth,
      `${HS_API_URL}/properties/v1/${objectType}/properties`,
      propertyOptions
    );
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updatePropertyForObject = async (
  auth,
  objectType,
  objectId,
  newProps
) => {
  try {
    const { data } = await http.patch(
      auth,
      `${HS_API_URL}/crm/v3/objects/${objectType}/${objectId}`,
      { properties: newProps }
    );
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
