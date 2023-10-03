import { CardMedia } from '@mui/material';


export default function Hero() {

    return(

    <div className='w-full z-0'>   
      
          <video
            autoPlay
            loop
            muted
            poster="https://assets.codepen.io/6093409/river.jpg"
            className="w-full h-[250px] object-cover z-0"
          >
            <source
              src="https://assets.codepen.io/6093409/river.mp4"
              type="video/mp4"
            />
          </video>
        
        </div>
    )



}