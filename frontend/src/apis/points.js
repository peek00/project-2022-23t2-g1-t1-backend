import axios from "axios";
import {API_BASE_URL} from "@/config/config";
export async function addPoint(requestBody,id){
    const response = await axios.post(API_BASE_URL+"/api/points/createAccount", requestBody, {
        withCredentials: true,
        headers: {
        userid :id
        }
      });
      return response;
    }

export async function getPoints(id){

  const response = await axios.get(API_BASE_URL+"/api/points/allpointsaccounts", {
    withCredentials: true,
    headers: {
    userid :id
    }
  });
  return response;
}

export async function getAllCompanyIds(){
  // let api_url = 'http://localhost:3000/allcompanyids'; 
  // try { 
  //     const response = await axios.get(api_url); 
  //     return response.data; 
  // } catch(error) { 
  //     return error; 
  // }
  let api_url = API_BASE_URL + '/api/points/allcompanyids'; 
  try { 
      const response = await axios.get(api_url, {withCredentials: true}); 
      return response.data; 
  } catch(error) { 
      return error; 
  }
  
}



  