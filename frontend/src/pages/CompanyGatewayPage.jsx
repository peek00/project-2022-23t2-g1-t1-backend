
import React from 'react';
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';
import ListWithIcon from '../components/account/ListWithIcon';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/userContext';
import { getPoints } from '../apis/points';


export default function CompanyGatewayPage(props) {

    const { userData, updateUserData } = useUserContext();
    console.log(userData.id);
    const [uniqueCompanyIdsArray, setUniqueCompanyIdsArray] = useState([]);
  const goBack = () => {
    window.history.back(); // This will take the user back one step in the browser's history.
  };





  const fetchData = async () => {
    try {
      console.log(userData.id);

      // Make an Axios GET request to the API endpoint
      const response = await axios.get("http://localhost:8000/api/points/allpointsaccounts", {
        withCredentials: true,
        headers: {
          userid: userData.id,
        },
      });
      console.log(response);

      if (response.data.data.length > 0) {
        const uniqueCompanyIds = new Set();
        response.data.data.forEach(item => {
          uniqueCompanyIds.add(item.company_id);
        });

        const uniqueCompanyIdsArray = Array.from(uniqueCompanyIds);
        setUniqueCompanyIdsArray(uniqueCompanyIdsArray);
        console.log(uniqueCompanyIdsArray);
      } else {
        console.log('No data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData.id]);










  

  


    return(

        <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-[20%] bg-[#1C2434] min-h-screen ">
        <SideBar />
      </div>

      {/* Content Area */}
      <div className="w-4/5 min-h-screen overflow-y-auto">
        <TopBar />
        <div className="min-h-screen overflow-y-auto">
        <div className='flex w-[100%] absolute top-[10%]'>  
          <h1 className='text-2xl ms-11 font-bold'>Point Accounts</h1>
          </div>
          
          <div className='absolute  left-[25%] top-[25%] min-w-[80%]'>
            
           <ListWithIcon company_id = {uniqueCompanyIdsArray}/>
          </div>
        </div>
      </div>
    </div>
  
  )

}


