import React from 'react';
export default function UserForm(){


    return(
        <div className="absolute overflow-x-auto w-[100%] mt-[30%] bg-[#F5F5F5] rounded-2xl">
            
            
            
            
            
<form class="p-10 text-center ">
    <div class ="row flex gap-12">
  <div class="mb-6 ml-12">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Name</label>
    <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  required/>
  </div>
  <div class="mb-6">
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address</label>
    <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
  </div>
  
  </div>
  <div class ="row flex gap-12">
  <div class="mb-6  ml-12">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Access/Role</label>
    
<select id="countries" class="bg-gray-50 border px-5 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
  <option>Customer</option>
  <option>Owner </option>
  <option>Manager</option>
  <option>Engineer</option>
  <option>Product Manager</option>
</select>

  </div>
  <div class="mb-6">
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Starting Points</label>
    <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
  </div>
  
  </div>
  <button type="submit" class="text-white  bg-[#1C2434] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
</form>

            
            </div>

    )
}