
import React from 'react';
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';
import UserSearch from '../components/common_utils/LogsSearch';

import LogsTable from '../components/logging_utils/LogsTable';
import FilterButton from '../components/common_utils/FilterButton';
import LogsSearch from '../components/common_utils/LogsSearch';


export default function LogsPage(){

    return(<div className='min-h-screen min-w-full'>
    <div className='container relative min-w-full min-h-screen'>
      <div className='w-[80%] relative min-h-full'>
        <TopBar/>
        <div className='absolute left-[25%] w-full'>
          <div className='min-h-screen'>
        
          </div>
       
          <div className='min-w-full fixed top-[10%] mb-10'>
            <div className='flex justify-around'>
          <FilterButton/>
          <LogsSearch/>
          <div className='w-1/4'></div>

          </div>


            
          
            <LogsTable/>
          </div>
        </div>
      </div>
      <div className='min-h-screen w-[20%] bg-[#1C2434]'>
        <SideBar/>
      </div>
    </div>
  </div>
  )

}