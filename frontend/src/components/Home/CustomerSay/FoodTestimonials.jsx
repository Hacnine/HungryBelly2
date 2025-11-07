import React, { useRef, useState } from 'react';
import CustomerCommentary from './CustomerCommentary';

const FoodTestimonials = ({ key }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current.play();
  };

  return (
    <div data-aos="fadeIn" className="flex flex-col lg:flex-row items-stretch bg-white w-full px-1" key={key}>
      {/* Commentary Section */}
      <div className="lg:w-[45%]  bg-commenttext text-black p-16 hidden lg:flex flex-col justify-between">
        <CustomerCommentary />
      </div>

      {/* Video Section */}
      <div className="lg:w-[55%] relative flex items-center justify-center bg-gray-100">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster="/products/Video.png"
        >
          <source
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlay}
              className=" text-white rounded-full p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="svg6481"
                width="60"
                height="60"
                fill="none"
                version="1.1"
                viewBox="0 0 50 50"
              >
                <circle
                  id="path6777"
                  cx="25"
                  cy="25"
                  r="18.512"
                  fill="#ffc900"
                  fillOpacity="1"
                  strokeWidth="4.704"
                ></circle>
                <path
                  id="path6656"
                  fill="#0f0e0b"
                  strokeWidth="8.501"
                  d="m33.773 26.32-3.906 2.255-8.612 4.97a1.57 1.57 30.009 0 1-2.353-1.359v-4.509l.002-9.944a1.57 1.57 150.009 0 1 2.353-1.358l3.905 2.255 4.706 2.718 3.905 2.255a1.57 1.57 90.009 0 1 0 2.718"
                ></path>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="lg:w-[45%]  bg-commenttext text-black p-8 lg:hidden flex flex-col justify-between">
        <CustomerCommentary />
      </div>
    </div>
  );
};

export default FoodTestimonials;
