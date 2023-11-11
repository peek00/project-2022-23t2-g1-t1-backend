


import React from 'react';

import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';
import UserSearch from '../components/common_utils/LogsSearch';
import UpdatePointsTable from '../components/account/UpdatePointsTable';


export default function UpdatePointsPage(){

    return(

        <div className='min-w-full min-h-screen'>
    <div className='container relative min-w-full min-h-screen'>
      <div className='w-[80%] relative min-h-full'>
        <div className='absolute left-[25%] w-full'>
          <div className='min-h-screen'>
       
          </div>
          <div className='min-w-full'>
            <UpdatePointsTable/>
          </div>
        </div>
      </div>
        <SideBar/>
        {/* <TopBar/> */}
    </div>
  </div>
    )






}
