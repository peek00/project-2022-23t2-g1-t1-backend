
import React from 'react';
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';
import ListWithIcon from '../components/account/ListWithIcon';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/userContext';
import { getPoints, getAllCompanyIds } from '../apis/points';
import { Link } from 'react-router-dom';
import {API_BASE_URL} from "@/config/config";


export default function CompanyGatewayPage(props) {

  const { userData, updateUserData } = useUserContext();
  console.log(userData.id);
  const [uniqueCompanyIdsArray, setUniqueCompanyIdsArray] = useState([]);
  const goBack = () => {
    window.history.back(); // This will take the user back one step in the browser's history.
  };

  useEffect(() => {
    getAllCompanyIds()
    .then((results) => {
      console.log(results.data);
      setUniqueCompanyIdsArray(results.data);
    })
    .catch((err) => {
      return err;
    });
  }, []);


  return (

    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-[20%] bg-[#1C2434] min-h-screen ">
        <SideBar />
      </div>

      {/* Content Area */}
      <div className="w-4/5 min-h-screen overflow-y-auto">
        <TopBar />
        <img
          src="/arrow.png" // Replace with the actual image URL
          alt="Go Back"
          onClick={goBack}
          style={{ cursor: 'pointer' }} className='absolute mt-[10%] left-[30%] w-[2%]'
        />
      
        <div className="min-h-screen overflow-y-auto">
          <div className='flex w-[100%] absolute top-[10%]'>  
            <h1 className='text-2xl ms-11 font-bold'>Point Accounts</h1>
          </div>
          <div className='absolute  left-[25%] top-[25%] min-w-[80%]'>
            <Link to="/addAccount"><button type="button" class=" fixed right-[10%] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">+</button></Link>
            <ListWithIcon company_id = {uniqueCompanyIdsArray}/>
          </div>
        </div>
      </div>
    </div>
  )
}


