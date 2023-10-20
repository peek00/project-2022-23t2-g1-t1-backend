import MenuDefault from "./MenuDefault.jsx";
  
export default function UserTable(){



    return (
       
            
            
        <div class="relative overflow-x-auto w-[75%]">
            <table class="w-full text-sm text-left bg-[#F5F5F5]">
                <thead class="text-xs text-gray-700 uppercasebg-[#F5F5F5]">
                    <tr className='border-b-2 border-[#A4A4A4]'>
                    <th scope="col" class="px-6 py-3">
                          
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" class="px-6 py-3 flex">
                            Points

                            
                        </th>
                       
                    </tr>
                </thead>
                <tbody>
                    <tr class=" bg-[#F5F5F5] border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                           <img src ="/user.png"/>
                        </th>
                        <td class="px-6 py-4">
                            ITSA TEST/Admin
                        </td>
                        <td class="px-6 py-4">
                            test@gmail.com
                        </td>
                        <td class="px-6 py-4">
                            Points
                        </td>
                        <td>
                            <MenuDefault/>
                       

                        </td>
                    </tr>
                    
                </tbody>
            </table>
        </div>
        
                    
    )
}