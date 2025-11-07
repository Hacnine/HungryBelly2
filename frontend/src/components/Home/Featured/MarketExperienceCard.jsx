import React from 'react';
import circle from '../../../assets/images/logos/circle.svg'
const MarketExperienceCard = () => {
  return (
    <div data-aos="bounceIn" className=" absolute md:left-8 top-6 left-10 flex items-center justify-center bg-white rounded-lg shadow-md p-3 w-44 h-24">
  
      <div className="relative flex items-center justify-center w-44 ">
     
        <img src={circle}  className='absolute md:size-12 size-10 md:-top-[14px] -top-[10px]' alt="" />
     
        <span className="text-sm w-16  text-center font-bold">50+</span>
      </div>


      <div className=" text-sm">
        <p className="font-semibold text-black">Market</p>
        <p className="text-black font-semibold">Experiences</p>
      </div>
    </div>
  );
};

export default MarketExperienceCard;
