import { PencilIcon } from "@heroicons/react/24/solid";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
 
const TABLE_HEAD = ["Timestamp", "User", "User Agent Info", "Location", "Data"];
 
const TABLE_ROWS = [
  {
   
    Timestamp: "30/09/2023, 17:38:59",
    User: "ITSA Test",
    userAgent: "Mozilla/4.0 (compatible; MSIE...",
    Location: "190.85.195, Cali, Colombia",
    Data: "{action: “REQUEST_TRANS...",
   
  },
  
  
  {
    Timestamp: "30/09/2023, 17:36:42",
    User: "ITSA Test",
    userAgent: "Mozilla/4.0 (compatible; MSIE...)",
    Location: "190.85.195, Cali, Colombia",
    Data:"{action: “REQUEST_TRANS..."
    
  },
  
];
 
export  default function LogsTable() {
  return (
    <Card className=" w-full  text-center absolute top-[20%] ">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            
            <Typography color="gray" className="mt-1 font-normal">
              These are details about the logs from the users
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
           
            
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
            {TABLE_ROWS.map(
              (
                {
                  Timestamp,
                    User,
                    userAgent,
                    Location,
                    Data,
                },
                index,
              ) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
 
                return (
                  <tr key={Timestamp}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {Timestamp}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {User}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {userAgent}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {Location}
                      </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {Data}
                      </Typography>
                      
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button variant="outlined" size="sm">
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <IconButton variant="outlined" size="sm">
            1
          </IconButton>
          <IconButton variant="text" size="sm">
            2
          </IconButton>
          <IconButton variant="text" size="sm">
            3
          </IconButton>
          <IconButton variant="text" size="sm">
            ...
          </IconButton>
          <IconButton variant="text" size="sm">
            8
          </IconButton>
          <IconButton variant="text" size="sm">
            9
          </IconButton>
          <IconButton variant="text" size="sm">
            10
          </IconButton>
        </div>
        <Button variant="outlined" size="sm">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}