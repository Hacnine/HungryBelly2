import React from "react";

const NextPrevButton = ({ sliderRef }) => {
  const handlePrevious = () => {
    sliderRef.current.slickPrev(); // Use the ref to control slider
  };

  const handleNext = () => {
    sliderRef.current.slickNext(); // Use the ref to control slider
  };

  return (
    <>
      <button
        data-aos="fadeIn"
        className="slider-arrow bg-white shadow-md shadow-gray-300 hover:bg-red-700 text-black hover:text-white rounded-full w-10 h-10 flex items-center justify-center"
        onClick={handlePrevious}
      >
        &#10094;
      </button>
      <button
        data-aos="fadeIn"
        className="slider-arrow bg-white shadow-md shadow-gray-300 hover:bg-red-700 text-customred hover:text-white rounded-full w-10 h-10 flex items-center justify-center"
        onClick={handleNext}
      >
        &#10095;
      </button>
    </>
  );
};

export default NextPrevButton;
