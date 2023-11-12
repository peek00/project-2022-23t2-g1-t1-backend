import React from 'react';
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';
import UpdateUserForm from '../components/user/UpdateUserForm';
import AddUserForm from '../components/user/AddUserForm';

export default function AddUserPage(props) {
  const goBack = () => {
    window.history.back(); // This will take the user back one step in the browser's history.
  };
  return (

    <div className='h-screen min-w-full min-h-screen overflow-y-auto'>
      <div className='container relative min-w-full min-h-screen overflow-y-auto'>
        <div className="w-[80%] relative min-h-full ">
          {/* <img
            src="/arrow.png" // Replace with the actual image URL
            alt="Go Back"
            onClick={goBack}
            style={{ cursor: 'pointer' }} className='absolute mt-[10%] left-[30%] w-[2%]'
          /> */}
          <div className='absolute left-[25%] w-full'>
            <div className='absolute left-[20%] min-w-[65%]'>
              {props.type === 'add' ? <AddUserForm /> : <UpdateUserForm />}
              <h1 className='text-3xl font-bold mt-[20%]'>
                {props.type === 'add' ? 'Add User' : 'Update User'}
              </h1>
            </div>
          </div>
        </div>
        <SideBar />
        {/* <TopBar /> */}
      </div>
    </div>

  )

}