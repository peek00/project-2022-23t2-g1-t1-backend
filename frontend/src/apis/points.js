
import axios from "axios";
export async function addPoint(requestBody,points){
    const response = await axios.post("http://localhost:8000/api/points/createAccount", requestBody, {
        withCredentials: true,
        userid :points
      });
      return response;
    }