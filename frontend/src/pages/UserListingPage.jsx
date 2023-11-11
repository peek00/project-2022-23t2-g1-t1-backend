import React from 'react';
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';
import UserTable from '../components/user/UserTable';

export default function UserListingPage() {
  return (
    <div className="flex min-h-screen">
      <SideBar />
        {/* <TopBar /> */}
      {/* Content Area */}
      <div className="w-4/5 min-h-screen overflow-y-auto">

          <div className='ms-[30%]  mt-[10%]  '>
            <UserTable />
          </div>
      </div>
    </div>
  );
}
