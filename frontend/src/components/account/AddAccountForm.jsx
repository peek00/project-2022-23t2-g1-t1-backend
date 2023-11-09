import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { addPoint } from '../../apis/points';
import { useUserContext } from '../../context/userContext';

export default function AddAccountForm() {
  const { userData, updateUserData } = useUserContext();

  
  const [formData, setFormData] = useState({
    startingPoints: '',
    companyID: '',
   
    
  });



  const [companyData, setCompany] = useState("");

  useEffect(() => {
    // Make an Axios GET request to the API endpoint
    axios.get('http://localhost:8000/api/points/allcompanyids',{withCredentials: true})
      .then(response => {
        // Handle the successful response and set the data to the state
        setCompany(response.data.data);
        
        
      // Set the companyID in the formData state to the first item in companyData
      if (response.data.data.length > 0) {
        setFormData({
          ...formData,
          companyID: response.data.data[0]
        });
      }
    })
      .catch(error => {
        // Handle any errors here, e.g., display an error message
        console.error('Error fetching data:', error);
      });
  }, []);

  
  console.log(formData)

  const handleChange = (e) => {
    console.log(formData);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addPointAccount = async (e) => {
    e.preventDefault();
    console.log(formData);
  
    try {
      // Create a request body, if needed
      const requestBody = {

        company_id: formData.companyID,
        balance: formData.startingPoints,
      
        
       
      };
      // May have to change this to user context
      console.log(requestBody);
      console.log(localStorage.getItem("id"));



      const response = addPoint(requestBody,localStorage.getItem("id"));
  
      // Assuming the response contains the user's role

      window.location.href = "/users";
  
    
      console.log(response);
    } catch (error) {
      // Handle errors here
      console.error("Cannot log out of auth:", error);
      throw error; // Optionally re-throw the error to propagate it to the caller
    }
  };



  return (
    <div className="absolute  w-[80%] mt-[30%] bg-[#F5F5F5] rounded-2xl">
      <form onSubmit={addPointAccount} className="p-10 text-center">
        <div className="row flex gap-12">
          <div className="mb-6 ml-12">
            <label htmlFor="startingPoints" className="block mb-2 text-sm font-medium text-gray-900">
              Starting Points
            </label>
            <input
              type="text"
              id="startingPoints"
              name="startingPoints"
              value={formData.startingPoints}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
          <div className="mb-6 ml-12">
            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">
              Company
            </label>
            <select
  id="companyID"
  name="companyID"
  value={formData.companyID}
  onChange={handleChange}
  className="bg-gray-50 border px-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
>
  {companyData && companyData.length > 0 ? (
    companyData.map((company) => (
      <option key={company} value={company}>
        {company}
      </option>
    ))
  ) : (
    <option value="">No companies available</option>
  )}
</select>

          </div>
          </div>
        </div>
        
        
        <button
          type="submit"
          className="text-white bg-[#1C2434] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
