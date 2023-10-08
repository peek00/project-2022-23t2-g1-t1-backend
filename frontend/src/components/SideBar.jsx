import React from 'react';

export default function SideBar(){


    return(
    <div className="min-h-screen  max-w-[20%] bg-[#1C2434]">

        <div>

            <div className="flex flex-col items-center justify-center">

                <img src = "/footerLogo.svg" className="h-[100px] w-[100px]"/>

                <h1 className="text-white text-sm font-thin active:font-thin hover:font-bold cursor-pointer opacity-80">Users</h1>
                <h1 className="text-white text-sm font-thin active:font-thin hover:font-bold cursor-pointer opacity-60">View Users</h1>
                <h1 className="text-white text-sm font-thin active:font-thin hover:font-bold cursor-pointer opacity-60">Enroll Users</h1>
                <h1 className="text-white text-sm font-thin active:font-thin hover:font-bold cursor-pointer opacity-60 mt-20">View Logs</h1>
                
                </div>

        </div>

       







    </div>
    )




}