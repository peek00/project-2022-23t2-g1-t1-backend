
import React from 'react';
import Hero from '../components/login/Hero';
import NavBar from "../components/common_utils/NavBar";
import SignUpForm from '../components/login/SignUpForm';


function LandingPage(){
  
    return(
        <div className='min-h-screen min-w-full'>
            <div className='container relative min-w-full'>
                <NavBar/>
                
            <Hero/>
          
            



            </div>
           


            
        </div>
    )
}

export default LandingPage;