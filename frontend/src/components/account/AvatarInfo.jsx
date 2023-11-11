import { Avatar, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

 
export  default function AvatarInfo(props) {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState([]);

     useEffect(() => {
        axios.get("http://localhost:8080/User/getUser?userID=" + userId)
            .then(response => {
                setUserInfo(response.data.data);
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            })
        // axios.get(API_BASE_URL + `/api/user/User/getUser?userID=` + userId, {withCredentials: true })
        //     .then(response => {
        //         setUserInfo(response.data.data);
        //     })
        //     .catch(error => {
        //         console.error("Error fetching data: ", error);
        //     })
      }, []);

  return (
    <div className="ms-[40px]">
      <div className=" items-center gap-4">
        <Avatar src="/user_324.png" alt="avatar" className="w-[324px] h-[324px] mt-10"/>
        <div>
          <Typography variant="h6">{userInfo.fullName}</Typography>
          <Typography variant="small" color="gray" className="font-normal opacity-60">
            {userInfo.email}
          </Typography>
        </div>
      </div>
      
    </div>
  );
}