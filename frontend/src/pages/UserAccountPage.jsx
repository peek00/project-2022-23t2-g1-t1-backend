import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';
import UserAccountTable from '../components/account/UserAccountTable';
import axios from "axios";
import {API_BASE_URL} from "@/config/config";

import { Link } from 'react-router-dom';
import { useUserContext } from '../context/userContext';
import {getAllAccountsByUserId} from '../apis/points';


export default function UserAccountPage() {
  
  const [accounts, setAccounts] = useState([]);
  console.log(accounts);
    
    const { userId } = useParams();
    console.log(userId );
  // console.log(companyId);
  // company and points

  useEffect(() => {
    // Have to change the data
    const fetchData = async () => {
      try {
        // Check if userid is available
        if (userId) {
          let response = await getAllAccountsByUserId(userId);
         
          const accounts = [];
          Object.keys(response.data).forEach((key) => {
            console.log(key);
            accounts.push(response.data[key][0]);
          });
          
          setAccounts(accounts);
          console.log(accounts);
        } 
        else {
          console.warn("userid is not available yet.");
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
  
    fetchData();
  }, [userId]);
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
        <SideBar />
        {/* <TopBar /> */}

      {/* Content Area */}
      <div className="w-4/5 min-h-screen overflow-y-auto">
        <div className="min-h-screen overflow-y-auto">
        <div className='flex w-[100%] absolute top-[10%]'>  
          <h1 className='text-2xl font-bold ms-11 fixed left-[20%]'>User Accounts</h1>
          </div>
          <Link to={`/user/account/${userId}/addPoints`}><button type="button" class=" fixed  top-[10%] right-[10%] text-white  bg-[#1C2434]  hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">+</button></Link>
          
          <div className='absolute  left-[25%] top-[25%] min-w-[80%]'>
            
            <UserAccountTable accounts={accounts}/>
          </div>
        </div>
      </div>
    </div>
  );
}
