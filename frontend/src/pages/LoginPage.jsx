import react from 'react';
import SignUpForm from '../components/login/SignUpForm';
import SignInForm from '../components/login/SignInForm';



export default function LoginPage(){
    const [isRegister,setIsRegister]=react.useState(false);
    
    
    return (<div className='min-h-screen min-w-full'>
 
         <SignInForm/>
       
        
        </div>)

}