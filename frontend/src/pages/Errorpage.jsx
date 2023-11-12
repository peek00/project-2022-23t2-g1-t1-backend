
import React from 'react';
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';

import EditPolicyTable from '../components/permission/EditPolicyTable';
import AlertIcon from '../components/common_utils/AlertIcon';

export default function ErrorPage(props) {
  const goBack = () => {
    window.history.back(); // This will take the user back one step in the browser's history.
  };


  

  


    return(

        <div className='h-screen min-w-full min-h-screen overflow-y-auto'>
    <div className='container relative min-w-full min-h-screen overflow-y-auto'>
      <div className="w-[80%] relative min-h-full ">
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
                        401 Error Unauthorized
                    </h1>
                  <AlertIcon className="p-12" message ="You do not have permissions to access this page. Please contact your admin!"/>
            </div>
          </div>
        </div>
      
        

        

        


        </div>
        <SideBar/>
        {/* <TopBar/> */}

    </div>
  </div>
  
  )

}


