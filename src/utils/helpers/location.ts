import axios from "axios";
import { mainConfig } from "../../config/config";
const config = mainConfig[process.env.APP_ENV as string];
import logger from "../logger/logger";
const location = async (ip: any) => {
  const API_URL = "https://api.ipgeolocation.io/ipgeo";
  // Define variable query parameter
  const queryParam = { apiKey: config.LOCATION_KEY, ip };
  // Set up the request configuration
  const request = {
    url: `${API_URL}`,
    method: "GET",
    params: queryParam,
  };
  try {
    // Make the request using axios and wait for the response
    const response = await axios(request);
    // Extract the desired fields and rename them
    const {
      continent_name,
      country_name,
      country_capital,
      city,
      country_flag,
      ip,
    } = response.data;
    // Create a new object with the desired fields and their values
    const locationData = {
      continentName: continent_name,
      countryName: country_name,
      countryCapital: country_capital,
      city,
      countryFlag: country_flag,
      ip,
    };
    // Return the location data
    return locationData;
  } catch (error) {
    // Handle any errors
    logger.error(error);
    throw error;
  }
};
export default location;
