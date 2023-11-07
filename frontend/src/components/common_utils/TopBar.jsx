
import React from 'react';
import 'flowbite';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {API_BASE_URL} from "@/config/config";

export default function TopBar(){

  

  const[settings,setSettings]=React.useState(false);



  const handleSettings=()=>{
    setSettings(!settings);
  }

  const signOut = async () => {
    try {
      const response = await axios.get(API_BASE_URL+"/auth/logout", {
        withCredentials: true
      });
  
      // Assuming the response contains the user's role
     
      // 

      window.location.href = "/"; 
      console.log(response);
    } catch (error) {
      // Handle errors here
      console.error("Cannot log out of auth:", error);
      throw error; // Optionally re-throw the error to propagate it to the caller
    }
  };

  


    return (
       
        <div className='fixed top-0 left-[20%] w-screen h-[7.5%] bg-[#EEEEEE] z-10'>
        <div className="ml-[20%] flex min-h-full min-w-full">
          <div className="absolute right-[30%] flex justify-between items-center">
            <img className="mx-2" src="/profile.png" alt="Profile" />
            <div>
            <h1 className="text-xs font-thin">Yi Peng</h1>
            <h1 className="block text-xs font-thin opacity-50 ">Admin</h1>
            <h1 className="text-xs font-thin">Yi Peng</h1>
            <h1 className="block text-xs font-thin opacity-50 ">Admin</h1>
            </div>
            <br></br>
              
            <div className="mx-2 mt-2">
            <div className="mx-2 mt-2">
           
            

              
            <div className="relative inline-block text-left">
  <div>
    <button type="button" className="inline-flex w-full justify-center gap-x-1.5 rounded-mdpx-3 py-2 text-sm font-semibold text-gray-900 shadow-sm  hover:bg-gray-50" onClick={handleSettings}>
      
      <svg className="w-5 h-5 -mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </button>
  </div>

 
 {settings&& (<div className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1" action="http://localhost:8000/auth/logout">
    <div className="py-1" role="none">
     
     
    
      
        <button type="submit" className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:cusor" role="menuitem" tabindex="-1" id="menu-item-3" onClick={signOut}>Sign Out</button>
     
    </div>
  </div>)}
</div>



             

            </div>
          </div>
        </div>
      </div>
      
    
      



        
        


       
            
            
            
            
        



        




    )



}