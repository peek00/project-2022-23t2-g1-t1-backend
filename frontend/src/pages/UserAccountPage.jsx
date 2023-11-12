import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';
import UserAccountTable from '../components/account/CompanyAccountTable';
import axios from "axios";
import {API_BASE_URL} from "@/config/config";
import { getAllUserAccountsByCompanyId } from '../apis/points';
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/userContext';


export default function UserAccountPage() {
  const { companyId } = useParams(); 
  const [accounts, setAccounts] = useState([]);
    
    const { userid } = useParams();
  // console.log(companyId);
  // company and points

  useEffect(() => {
    // Have to change the data
    const fetchData = async () => {
      try {
        const results = await getAllUserAccountsByCompanyId(companyId);
        const accountsData = results.data;

        // Fetch additional data for each account
        const accountsWithAdditionalData = await Promise.all(
          accountsData.map(async (account) => {
            try {
              const response = await axios.get(
                API_BASE_URL +
                  `/api/user/User/getUser?userID=` +
                  account["user_id"],
                {
                  withCredentials: true,
                }
              );
              // const response = await axios.get("http://localhost:8080/User/getUser?userID=" + account["user_id"]);
              // Merge the additional data with the account data
              return { ...account, userData: response.data.data };
            } catch (error) {
              console.error("Error fetching user data:", error);
              return account; // Return the original account if the request fails
            }
          })
        );

        setAccounts(accountsWithAdditionalData);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchData();
  }, [companyId]);

  useEffect(() => {
    console.log("Accounts updated:", accounts);
  }, [accounts]);

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
          <Link to={`/user/account/${userid}/addPoints`}><button type="button" class=" fixed  top-[10%] right-[10%] text-white  bg-[#1C2434]  hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">+</button></Link>
          
          <div className='absolute  left-[25%] top-[25%] min-w-[80%]'>
            
            <UserAccountTable accounts={accounts} companyId={companyId}/>
          </div>
        </div>
      </div>
    </div>
  );
}
