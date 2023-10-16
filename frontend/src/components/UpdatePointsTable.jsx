

import React from 'react';
import AvatarText from './AvatarText';
export default function UpdatePointsTable(){


    return(


    <div className=" w-[80%]  text-center absolute top-[20%]">
        


        



     
<form className='flex bg-[#F5F5F5] ms-[20%] mt-10 rounded-2xl '>
    <div>
        <AvatarText/>
    </div>
    <div className='flex flex-col mt-[162px] ms-10 text-center'>
        <div className='flex gap-4 text-center'>
        <button type="button" class="text-black hover:bg-[#1C2434] hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium  text-sm px-5 py-2.5 text-center mr-2 mb-2 ">-</button>
        <input type="text" id="disabled-input" aria-label="disabled input" class="ps-[10px] rounded-3xl py-10 mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm text-center focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" value="1000" disabled/>

        <button type="button" class="text-black hover:bg-[#1C2434] hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium  text-sm px-5 py-2.5 text-center mr-2 mb-2 ">+</button>
        </div>
        <div className='flex gap-2 text-center mt-10 ms-10'>
        <button type="button" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white bg-[#D9D9D9]">+25</button>
        <button type="button" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white bg-[#D9D9D9]">+50</button>
        <button type="button" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white bg-[#D9D9D9]">+100</button>
       
        </div>

        <button type="button" class="focus:outline-none my-[20px] text-white font-medium bg-[#1C2434] hover:font-bold focus:ring-4 focus:ring-purple-300 rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Submit</button>



    </div>

    

  
</form>

    </div>
    );





}