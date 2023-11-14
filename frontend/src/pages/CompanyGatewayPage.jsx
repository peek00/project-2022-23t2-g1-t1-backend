
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
import { Spinner } from '@material-tailwind/react';

export default function CompanyGatewayPage(props) {

  const { userData, updateUserData } = useUserContext();
  //console.log(userData.id);
  const [uniqueCompanyIdsArray, setUniqueCompanyIdsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const goBack = () => {
    window.history.back(); // This will take the user back one step in the browser's history.
  };
  const fetchData = async () => {
    try {
      // Make an Axios GET request to the API endpoint
      const response = await axios.get(API_BASE_URL+"/api/points/allpointsaccounts", {
        withCredentials: true,
        headers: {
          userid: userData.id,
        },
      });
      //console.log(response);

      if (response.data.data.length > 0) {
        const uniqueCompanyIds = new Set();
        response.data.data.forEach(item => {
          uniqueCompanyIds.add(item.company_id);
        });

        const uniqueCompanyIdsArray = Array.from(uniqueCompanyIds);
        setUniqueCompanyIdsArray(uniqueCompanyIdsArray);
        //console.log(uniqueCompanyIdsArray);
      } else {
        //console.log('No data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getAllCompanyIds()
    .then((results) => {
      //console.log(results.data);
      setUniqueCompanyIdsArray(results.data);
    })
    .catch((err) => {
      console.error("Error fetching company data: ", err);
    })
    .finally(() => {
      setIsLoading(false);
    })
  }, []);


  return (

    <div className="flex min-h-screen">
      {/* Sidebar */}
        <SideBar />
        {/* <TopBar /> */}

      {/* Content Area */}
      <div className="w-4/5 ms-[10%] min-h-screen overflow-y-auto">
        {/* <img
          src="/arrow.png" // Replace with the actual image URL
          alt="Go Back"
          onClick={goBack}
          style={{ cursor: 'pointer' }} className='absolute mt-[10%] left-[30%] w-[2%]'
        /> */}
      
        <div className="min-h-screen overflow-y-auto">
          <div className='flex w-[100%] absolute top-[10%]'>  
            <h1 className='text-2xl font-bold ml-[175px]'>Point Accounts</h1>
          </div>
          <div className='absolute  left-[25%] top-[25%] min-w-[80%]'>
            {
              isLoading ?
              <Spinner color="teal" size="large" className='mt-20'/> :
              <ListWithIcon company_id = {uniqueCompanyIdsArray}/>
            }
          </div>
        </div>
      </div>
    </div>
  )
}