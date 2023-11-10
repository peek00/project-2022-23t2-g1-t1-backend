import React, { useState,useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
} from "@material-tailwind/react";
// ... (other imports)
import {API_BASE_URL} from "@/config/config";




const ITEMS_PER_PAGE = 5; // Set the number of items per page

const TABLE_HEAD = ["Timestamp", "User", "User Agent Info", "Location", "Data"];

 function LogsTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // This code will run when the component mounts

    // Make a GET request using Axios
    axios.get(API_BASE_URL+'/api/logging/logs', {
  withCredentials: true
})
  .then((response) => {
    console.log(response.data);
    // Handle the successful response here
    setData(response.data);
  })
  .catch((error) => {
    // Handle errors here
    console.error('Error fetching data:', error);
    
  });

  console.log(data);


  }, []); // Don't forget the `[]`, which will prevent useEffect from running in an infinite loop



  const [currentPage, setCurrentPage] = useState(1);

  const TABLE_ROWS = data;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedRows = TABLE_ROWS.slice(startIndex, endIndex);

 

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <Card className="w-full text-center absolute top-[20%]">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex flex-col justify between gap-8 md:flex-row md:items-center">
            <div>
              <Typography color="gray" className="mt-1 font-normal">
                These are details about the logs from the users
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                
                {TABLE_HEAD.map((head) => (
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
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedRows && displayedRows.length > 0 && displayedRows.map(
                ({
                  timestamp,
                  userId,
                  userAgent,
                  country,
                  message,
                }) => {
                  return (
                    <tr key={timestamp}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {timestamp}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {userId}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {userAgent}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <div className="w-max">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {country}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {message}
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Button
            variant="outlined"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
  <IconButton
    key={1}
    variant={currentPage === 1 ? "outlined" : "text"}
    size="sm"
    onClick={() => handlePageChange(1)}
  >
    1
  </IconButton>
  {/* {Array.from({ length: totalPages - 1 }, (_, index) => (
    <IconButton
      key={index + 2}
      variant={currentPage === index + 2 ? "outlined" : "text"}
      size="sm"
      onClick={() => handlePageChange(index + 2)}
    >
      {index + 2}
    </IconButton>
  ))} */}
</div>
          <Button
            variant="outlined"
            size="sm"
           
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LogsTable;