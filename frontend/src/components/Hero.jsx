import { CardMedia } from '@mui/material';


export default function Hero() {

    return(

    <div className='w-full relative'>   
      
          <video
            autoPlay
            loop
            muted
            poster="https://assets.codepen.io/6093409/river.jpg"
            className="w-full h-[300px] object-cover z-0"
          >
             
            <source
              src="https://assets.codepen.io/6093409/river.mp4"
              type="video/mp4"
            />
          </video>
          <h1 className='font-bold text-[50px] absolute top-[65px] left-[25%] text-white cursor-pointer'>Accelerate your growth <br></br>with world-class rewards</h1>
         
         <div className='container text-center pt-5 mx-auto'>

            <h3 className=' text-[#1C2434] text-4xl font-semibold'>Deliver “awesome,” effortlessly</h3>
            <p className='text-[#1C2434] font-extralight mt-5'>Ascenda equips banks and fintechs with plug & play APIs and UIs to deploy world-class rewards easily and rapidly</p>
            <div className ="md:flex md:justify-between mt-5 grid-rows-3 gap-4 grid-flow-col">
               
<div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white dark:border-slate-100">
   
    <img src ="https://images.prismic.io/ascendaloyaltycorp/4b4ab6d4-99e4-44a4-8ba9-89add6d58109_rewards-card.svg?auto=compress,format" className ="mt-3"/>
    <h1 className='text-[#1C2434] font-xl font-semibold text-sm'>Points Service</h1>
    <p class="mb-3 font-normal text-[#1C2434]">Ascenda Loyalty Customer can update their points securely through our rewards programme.</p>
    
</div>

<div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white dark:border-slate-100">
   
    <img src ="https://images.prismic.io/ascendaloyaltycorp/bf807abd-27d8-4e39-87f9-18c52ff127ea_co-brands-card.svg?auto=compress,format" className ="mt-3"/>
    <h1 className='text-[#1C2434] font-xl font-semibold text-sm'>User Service</h1>
    <p class="mb-3 font-normal text-[#1C2434]">Enrollment of Admin Users to manage their rewards</p>
    
</div>

<div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white dark:border-slate-100">
   
    <img src ="https://images.prismic.io/ascendaloyaltycorp/1395ecb8-fce3-477d-9014-6f96b32df370_whole-of-bank.svg?auto=compress,format" className ="mt-3"/>
    <h1 className='text-[#1C2434] font-xl font-semibold text-sm'>Logging Service</h1>
    <p class="mb-3 font-normal text-[#1C2434]">Secure and Reliable Logging of User's Actions</p>
    
</div>






            </div>


         </div>
         <div className='container flex justify-between bg-['>




         </div>
         
        
        </div>
        
    )



}