import React from 'react';
import { Link } from 'react-router-dom';

export default function SideBar(){


    return(
    <div className="min-h-screen w-[100%] z-50 relative">

        <div>

            <div className="flex flex-col items-center justify-center">

                <Link to="/users"><img src = "/footerLogo.svg" className="h-[100px] w-[100px]"/></Link>

                
                <h1 className="text-white text-sm font-thin active:font-thick hover:font-bold cursor-pointer opacity-60 "><Link to="/users">View Users</Link></h1>
                <h1 className="text-white text-sm font-thin active:font-thin hover:font-bold cursor-pointer opacity-60"><Link to="/addUser">Enroll User</Link></h1>
                <h1 className="text-white text-sm font-thin active:font-thin hover:font-bold cursor-pointer opacity-60 mt-20"><Link to="/logs">Logs</Link></h1>
                
                </div>

        </div>

       







    </div>
    )




}