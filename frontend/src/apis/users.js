


import axios from 'axios';
import {API_BASE_URL} from "@/config/config";

export async function addUser(requestBody){
    const response = await axios.post(API_BASE_URL+"/api/user/User/createUser", requestBody, {
        withCredentials: true
      });
      return response;
    }

    export async function updateUser(formData) {
      try {
        // Create a request body, if needed
        const requestBody = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: [formData.role],
        };
    
        const userId = formData.id;
        const response = await axios.put(API_BASE_URL+`/api/user/User/updateUser?userID=${userId}`, requestBody, {
          withCredentials: true
        });
    
        return response.data; // You can return the response data if needed
      } catch (error) {
        // Handle errors here
        console.error("Error while updating user:", error);
        throw error;
      }
    }
  


  

    