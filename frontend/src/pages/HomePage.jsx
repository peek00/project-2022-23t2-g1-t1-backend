
import React, {useState, useEffect} from 'react';
import SideBar from '../components/common_utils/SideBar';


function HomePage(){
    const [role, setRole] = useState(null);
  const [userName, setName] = useState("");
  useEffect(() => {
    setRole(localStorage.getItem("role").replace(/[\[\]"\s]/g, ''));
    setName(localStorage.getItem("UserName").replace(/"/g, ''));
  }, []);
    return(
        <div className='h-full'>
            <SideBar />
            <div className='w-full ms-[10%] px-24  '>
                <p className='py-24 text-6xl '>
                    Welcome to <span className='text-blue-800'> Ascenda Loyalty App!</span>
                </p>
                As an {role} you can do the following:
            </div>
        </div>
    )
}

export default HomePage;