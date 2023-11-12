import React, { useMemo } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";

function LogsTable({ pageData}) {
  if (pageData == null) {
    return (
      "Penidng"
      )
    }
    
  return (
    <div className="ms-10">
    {pageData.length > 0 ? (
      <table className="relative text-left table-auto min-w-max">
        <thead>
          <tr>
            {Object.keys(pageData[0]).map((key, index) => (
              <th key={index} className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
            <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {key}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((item, index) => (
              <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-50"} key={index}>
              {Object.values(item).map((value, index) => (
                <td
                  key={index}
                  className="p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {value}
                  </Typography>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No data available</p>
    )}
  </div>
)
    }

export default LogsTable;
//   return (
//     <div className="ms-10">
//       {pageData.length > 0 ? (
//         <table className="relative text-left table-auto min-w-max">
//           <thead>
//             <tr>
//               {columns.map((column) => (
//                 <th
//                   key={column}
//                   className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50"
//                 >
//                   <Typography
//                     variant="small"
//                     color="blue-gray"
//                     className="font-normal leading-none opacity-70"
//                   >
//                     {column}
//                   </Typography>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {pageData.map((row, rowIndex) => (
//               <tr className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"} key={rowIndex}>
//                 {columns.map((column) => (
//                   <td key={column} className="p-4">
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className="font-normal"
//                     >
//                       {row[column]}
//                     </Typography>
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <Typography className="mt-5 text-center" color="gray">
//           No logs found
//         </Typography>
//       )}
//       <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
//         <Button
//           variant="outlined"
//           size="sm"
//           onClick={() => goBack()}
//           className={pageNumber === 1 ? 'opacity-50 cursor-not-allowed' : ''}
//           disabled={pageNumber === 1}
//         >
//           Previous
//         </Button>
//         {pageNumber}
//         <Button variant="outlined" size="sm" onClick={() => goForward()}>
//           Next
//         </Button>

//       </div>
//     </div>
//   );
// }

// export default LogsTable;
