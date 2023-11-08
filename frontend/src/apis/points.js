
import axios from "axios";
export async function addPoint(requestBody,id){
    const response = await axios.post("http://localhost:8000/api/points/createAccount", requestBody, {
        withCredentials: true,
        headers: {
        userid :id
        }
      });
      return response;
    }