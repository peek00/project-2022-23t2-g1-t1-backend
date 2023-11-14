import React, { useState } from 'react';
import axios from 'axios';
import { addUser } from '../../apis/users';

export default function AddUserForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'User',
    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    //console.log(formData);
  
    try {
      // Create a request body, if needed
      const requestBody = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role:[formData.role],
      };
      //console.log(requestBody)
      const response = addUser(requestBody)
    
      // Assuming the response contains the user's role
      //console.log(response);
      // window.location.href = "/users";
      alert("User Created Successfully!")
      window.location.replace("/users");;
    } catch (error) {
      //console.log(error);
      // Handle errors here
      console.error("Cannot log out of auth:", error);
      throw error; // Optionally re-throw the error to propagate it to the caller
    }
  };



  return (
    <div className="absolute  w-[80%] mt-[30%] bg-[#F5F5F5] rounded-2xl">
      <form onSubmit={handleAdd} className="p-10 text-center">
        <div className="row flex gap-12">
          <div className="mb-6 ml-12">
            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900">
              First Name
            </label>
            <input
              type="text"
              id="name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
          <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900">
             Last Name
            </label>
            <input
              type="text"
              id="name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div className="row flex gap-12">
          <div className="mb-6 ml-12">
            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">
              Access/Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-gray-50 border px-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="User">User</option>
              <option value="Owner">Owner</option>
              <option value="Manager">Manager</option>
              <option value="Engineer">Engineer</option>
              <option value="Product Manager">Product Manager</option>
            </select>
          </div>
         
          <div class="mb-6">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
    <input  name="email" value={formData.email} onChange={handleChange} type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  required/>
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
