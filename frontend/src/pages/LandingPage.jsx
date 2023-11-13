
import React from 'react';
import Hero from '../components/login/Hero';
import NavBar from "../components/common_utils/NavBar";



function LandingPage(){
  
    return(
        <div className='min-h-screen min-w-full overflow-y-hidden'>
            <div className='container relative min-w-full overflow-y-hidden'>
                <NavBar/>
                
            <Hero/>
          
            



            </div>
           


            
        </div>
    )
}

export default LandingPage;