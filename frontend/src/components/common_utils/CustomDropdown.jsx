import React from 'react';

export default function CustomDropdown({label, id, options, setSelected}){
  return (
    <div className='mr-10'>
      <label htmlFor={id} class="text-sm me-10 font-medium text-gray-900 dark:text-white">{label}</label>
      {
        options && options.length > 0 ? 
          <select id={id} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={
            (e) => {
              setSelected(e.target.value);
            }
          }>
            <option key="Select a log group">Select a log group</option>
            {
              options.map((o,index) => {
                return (
                  <option key={index} value={o}>{o}</option>
                )
              }) 
            }
          </select>
          : 
          <select id={id} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option>No options available</option>
          </select>
        }
    </div>
  )
}