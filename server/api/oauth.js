import axios from "axios";
import { HS_API_URL } from "../constants.js";

export const fetchAccessAndRefreshTokens = async (exchangeProof) => {
  try {
    const { data: tokenData } = await axios.post(
      `${HS_API_URL}/oauth/v1/token`,
      exchangeProof,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    console.log(tokenData);
    return tokenData;
  } catch (e) {
    console.error(
      `Error fetching ${exchangeProof.grant_type} for access token`
    );
    throw e;
  }
};

export const fetchAccessTokenMetadata = async (token) => {
  try {
    const { data: tokenMetadata } = await axios.get(
      `${HS_API_URL}/oauth/v1/access-tokens/${token}`
    );

    return tokenMetadata;
  } catch (e) {
    console.error(`Error fetching access token metadata`);
    throw e;
  }
};
