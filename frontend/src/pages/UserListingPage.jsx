import React from 'react';
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';
import UserSearch from '../components/common_utils/LogsSearch';
import UserTable from '../components/user/UserTable';

export default function UserListingPage() {
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
         
        


          <div className='absolute  left-[25%] top-[50%] min-w-[80%]'>
 
            <UserTable />
            
          </div>
        </div>
      </div>
    </div>
  );
}
