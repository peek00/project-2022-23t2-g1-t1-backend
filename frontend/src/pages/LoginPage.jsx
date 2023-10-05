import react from 'react';
import SignUpForm from '../components/SignUpForm';
import SignInForm from '../components/SignInForm';



export default function LoginPage(){
    const [isRegister,setIsRegister]=react.useState(false);
    
    
    return (<div className='min-h-screen min-w-full'>
        {isRegister && <SignUpForm updateRegister={setIsRegister}/>}
        {!isRegister && <SignInForm updateRegister={setIsRegister}/>}
        
        </div>)

}