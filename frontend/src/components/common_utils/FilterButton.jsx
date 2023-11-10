import React from 'react';




export default function FilterButton(){


    return (
    
<div className="w-1/4 h-1/2 ">
<label for="logs" class="text-sm font-medium text-gray-900 dark:text-white">Filter Logs By</label>
<select id="logs" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
  <option selected>Choose an option below</option>
  <option value="User Id">User Id</option>
  <option value="Start Time">Start Time</option>
  <option value="End Time">End Time</option>

</select>
</div>
    )


}