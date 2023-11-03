


import axios from 'axios';


export async function addUser(requestBody){
    const response = await axios.post("http://localhost:8000/api/user/User/createUser", requestBody, {
        withCredentials: true
      });
      return response;
    }