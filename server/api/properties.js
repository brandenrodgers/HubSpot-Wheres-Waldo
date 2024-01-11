import http from "../utils/http.js";
import { HS_API_URL } from "../constants.js";

export const getPropertyForObject = async (portalId, objectType, property) => {
  try {
    const { data } = await http.get(
      portalId,
      `${HS_API_URL}/properties/v1/${objectType}/properties/named/${property}`
    );
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createPropertyForObject = async (
  portalId,
  objectType,
  propertyOptions
) => {
  try {
    const { data } = await http.post(
      portalId,
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
  portalId,
  objectType,
  objectId,
  newProps
) => {
  try {
    const { data } = await http.patch(
      portalId,
      `${HS_API_URL}/crm/v3/objects/${objectType}/${objectId}`,
      { properties: newProps }
    );
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
