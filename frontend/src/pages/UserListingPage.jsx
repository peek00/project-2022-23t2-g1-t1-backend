
import React from 'react';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import UserSearch from '../components/UserSearch';
import UserTable from '../components/UserTable';


export default function UserListingPage(){

    return(<div className='min-h-screen min-w-full'>
    <div className='container relative min-w-full min-h-screen'>
      <div className='w-[80%] relative min-h-full'>
        <TopBar/>
        <div className='absolute left-[25%] w-full'>
          <div className='min-h-screen'>
            <UserSearch/>
          </div>
          <div className='absolute left-[20%] top-[50%] min-w-[80%]'>
            <UserTable/>
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