import React, { useState,useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
} from "@material-tailwind/react";

function LogsTable({pageData, prevPage, nextPage, goBack, goForward}) {

  return (
    <div>
      
      <Card className="w-full text-center absolute top-[250%]">

        <CardBody className="overflow-scroll px-0">
          {
            pageData.length > 0 ?
            <table className="min-w-max table-auto text-left">
            <thead>
              <tr>
                {
                  Object.keys(pageData[0]).map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {
                pageData.map((row,index) => (
                  <tr key={index}>
                    {
                      Object.values(row).map((value) => (
                        <td
                          key={value}
                          className="p-4"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {value}
                          </Typography>
                        </td>
                      ))
                    }
                  </tr>
                ))
              }
            </tbody>
            </table>
            : 
            <Typography className="text-center mt-5" color="gray">
              No logs found
            </Typography>
          }
        </CardBody>

        <CardFooter className="items-center border-t border-blue-gray-50 p-4">
          {
            prevPage !== null ?
            (<Button
              variant="outlined"
              size="sm"
              onClick={() => goBack()}
            >
              Previous
            </Button>) :
            null
          }
          {
            nextPage !== null ?
            (<Button
              variant="outlined"
              size="sm"
              onClick={() => goForward()}
            >
              Next
            </Button>) :
            null
          }
        </CardFooter>
        
      </Card>
    </div>
  );
}

export default LogsTable;