
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

export async function getPoints(id){

  const response = await axios.get("http://localhost:8000/api/points/allpointsaccounts", {
    withCredentials: true,
    headers: {
    userid :id
    }
  });
  return response;
}



  