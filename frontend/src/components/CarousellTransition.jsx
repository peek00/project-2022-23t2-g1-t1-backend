import { Carousel } from "@material-tailwind/react";
 
export  default function CarouselTransition() {
  return (
    <Carousel transition={{ duration: 1 }} autoplay={true} prevArrow={null} nextArrow={null} loop ={true}>
      <div className="h-full w-full relative text-center">
        
       
        
        <img src="/rewardsText.png" className="absolute bottom-[25%] left-[10%]"/>
        
      <img
        src="https://images.prismic.io/ascendaloyaltycorp/2cbc3b57-8aac-4249-a362-acc265c205ee_WhatsApp+Image+2022-07-08+at+14.28.08.jpeg"
        alt="image 1"
        className="h-full w-full object-cover text-center"
      />
      </div>
      <div className="h-full w-full relative text-center">
        
       
        
        <img src="/offers.png" className="absolute bottom-[15%] left-[10%]"/>
        
      <img
        src="https://images.prismic.io/ascendaloyaltycorp/e5d55763-aea7-42c8-a608-9560a60a8f66_8-1024x682.jpeg"
        alt="image 1"
        className="h-full w-full object-cover text-center"
      />
      </div>
      <div className="h-full w-full relative text-center">
        
       
        
        <img src="/relationship.png" className="absolute bottom-[15%] left-[10%]"/>
        
      <img
        src="https://images.prismic.io/ascendaloyaltycorp/217dfd5c-79a4-4f06-9dec-c435140b8f28_WhatsApp+Image+2022-07-08+at+14.33.24.jpeg"
        alt="image 1"
        className="h-full w-full object-cover text-center"
      />
      </div>
    </Carousel>
  );
}