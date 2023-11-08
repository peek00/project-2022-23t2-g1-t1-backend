import React from 'react';
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';
import UserAccountTable from '../components/UserAccountTable';

export default function UserAccountPage() {
  return (
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
          <h1 className='text-2xl ms-11 font-bold'>Accounts</h1>
          </div>
          
          <div className='absolute  left-[25%] top-[25%] min-w-[80%]'>
            
            <UserAccountTable />
          </div>
        </div>
      </div>
    </div>
  );
}
