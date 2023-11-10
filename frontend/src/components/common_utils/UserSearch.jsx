import React from 'react';
import { Link } from 'react-router-dom';
export default function UserSearch(props)
{



    return (
        <div className="flex">
        <input type = "text" placeholder="Search by Email " className='border-2 border-gray-300 rounded-md w-[30%] h-[5%] pl-[2%] pr-[2%] mb-11 '></input>
        <button type="submit" class="h-full p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
        <span class="sr-only">Search by email </span>
    </button>
    </div>

        


        

    )






}