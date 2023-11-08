
import React from 'react';
import Hero from '../components/Hero';
import NavBar from "../components/NavBar";
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