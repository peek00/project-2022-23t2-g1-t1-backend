
import React from 'react';
export default function TopBar(){


    return (
        <div className='min-h-screen min-w-full'>
    <div className="min-h-[7.5%] min-w-[80%] bg-[#EEEEEE] fixed top-0 left-[20%] flex ">

        <div className='absolute left left-[85%] flex justify-between'>
            <img  claspath ="mx-2" src ="/profile.png"/>
            <div className='mt-2 mx-2'>
            <h1 className='font-thin text-xs'>Yi Peng</h1>
            <h1 className='font-thin text-xs opacity-50'>Admin</h1>





            </div>




        </div>


        </div>



        
        


        <div className='absolute left-[10%] top-[450%]'>
            
            
<div class="relative overflow-x-auto w-[150%]">
    <table class="w-full text-sm text-left bg-[#CACACA]">
        <thead class="text-xs text-gray-700 uppercasebg-[#CACACA]">
            <tr className='border-b-2 border-[#A4A4A4]'>
            <th scope="col" class="px-6 py-3">
                  
                </th>
                <th scope="col" class="px-6 py-3">
                    Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Email
                </th>
                <th scope="col" class="px-6 py-3">
                    Points
                </th>
               
            </tr>
        </thead>
        <tbody>
            <tr class=" bg-[#CACACA] border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   <img src ="/user.png"/>
                </th>
                <td class="px-6 py-4">
                    ITSA TEST /Admin
                </td>
                <td class="px-6 py-4">
                    test@gmail.com
                </td>
                <td class="px-6 py-4">
                    Points
                </td>
            </tr>
            
        </tbody>
    </table>
</div>

            </div>
            
            
            
            
                    </div>
        



        




    )



}