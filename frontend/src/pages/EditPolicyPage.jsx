
import React from 'react';
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';

import EditPolicyTable from '../components/permission/EditPolicyTable';

export default function AddAccountPage(props) {
  const goBack = () => {
    window.history.back(); // This will take the user back one step in the browser's history.
  };


  

  


    return(

        <div className='min-h-screen h-screen min-w-full overflow-y-auto'>
    <div className='container relative min-w-full min-h-screen overflow-y-auto'>
      <div className="w-[80%] relative min-h-full ">
      <TopBar/>
      <img
      src="/arrow.png" // Replace with the actual image URL
      alt="Go Back"
      onClick={goBack}
      style={{ cursor: 'pointer' }} className='absolute mt-[10%] left-[30%] w-[2%]'
    />
      
      
      
      <div className='absolute left-[25%] w-full'>
          
          <div className='absolute left-[20%] min-w-[65%]'>
            <div className='container'>
                    <h1 className='text-3xl font-bold mt-[20%]'>
                        Edit Policies
                    </h1>
                    <EditPolicyTable/>
            </div>
          </div>
        </div>
      
        

        

        


        </div>
      <div className='min-h-screen overflow-y-auto flex w-[20%] '>
        <SideBar/>
      </div>
    </div>
  </div>
  
  )

}


