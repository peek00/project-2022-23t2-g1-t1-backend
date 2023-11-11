import axios from "axios";
import {API_BASE_URL} from "@/config/config";

export const queryLog = async (reqParams) => {
  try {
    const response = await axios({
      method: 'GET',
      url: API_BASE_URL + "/api/logging/logs",
      params: reqParams,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
}

export const getAllLogGroups = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: API_BASE_URL + "/api/logging/logs/group",
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
}