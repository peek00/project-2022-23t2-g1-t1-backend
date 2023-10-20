import { Avatar, Typography } from "@material-tailwind/react";
 
export  default function AvatarText() {
  return (
    <div className="ms-[40px]">
      <div className=" items-center gap-4">
        <Avatar src="/user_324.png" alt="avatar" className="w-[324px] h-[324px] mt-10"/>
        <div>
          <Typography variant="h6">ITSA Test</Typography>
          <Typography variant="small" color="gray" className="font-normal opacity-60">
            Admin
          </Typography>
        </div>
      </div>
      
    </div>
  );
}