
import React, { useState } from 'react';

const Hero = () => {



    return (
        <div className="flex flex-col items-center justify-center  md:bg-hero-bg bg-hero-sm bg-cover overflow-hidden -mt-20 text-white px-4 h-[750px]">
            {/* Header */}
            <div data-aos="fadeIn" className="mb-6">
                <h1
                    data-testid="HomePageHeroHeader"
                    className="text-3xl md:text-4xl font-semibold font-poppins text-center capitalize"
                >
                    Discover restaurants and more near you.
                </h1>
            </div>

            {/* Address Input */}
            <div data-aos="slideInUp" className="flex flex-col items-center w-full max-w-md space-y-4">
                <form
                    autoComplete="off"
                    className="w-full flex items-center bg-white rounded-full "
                >
                    <button
                        type="button"
                        aria-label="Find Restaurants"
                        className="flex w-[40px] items-center justify-center p-3  text-gray-600  mr-1.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21c-4.97-5.373-8-9.198-8-12A8 8 0 0112 3a8 8 0 018 6c0 2.802-3.03 6.627-8 12z" />
                            <circle cx="12" cy="9" r="2.5" fill="currentColor" />
                        </svg>

                    </button>
                    {/* Input Field */}
                    <input
                        type="text"
                        placeholder="Enter delivery address"
                        aria-label="Enter delivery address"
                        className="flex-grow py-3 px-4 -ml-5 rounded-l-full text-black outline-none"
                    />
                    {/* Button */}
                    <button
                        type="button"
                        aria-label="Find Restaurants"
                        className="flex size-[40px] items-center justify-center p-3 bg-customred rounded-full text-white hover:bg-customred mr-1.5"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                d="M12.2929 17.2929C11.9024 17.6834 11.9024 18.3166 12.2929 18.7071C12.6834 19.0976 13.3166 19.0976 13.7071 18.7071L19.1578 13.2564C19.242 13.1722 19.3427 13.0717 19.4241 12.9758C19.5183 12.8648 19.6439 12.6962 19.7195 12.4635C19.8174 12.1623 19.8174 11.8377 19.7195 11.5365C19.6439 11.3038 19.5183 11.1352 19.4241 11.0242C19.3427 10.9283 19.242 10.8278 19.1578 10.7436L13.7071 5.29289C13.3166 4.90237 12.6834 4.90237 12.2929 5.29289C11.9024 5.68342 11.9024 6.31658 12.2929 6.70711L16.5858 11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44771 13 5 13H16.5858L12.2929 17.2929Z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </button>
                </form>

                {/* Sign-in for saved address */}
                <button
                    type="button"
                    data-aos="fadeInUp"
                    className="bg-white text-gray-600 font-semibold py-3 text-xs px-6 rounded-full hover:bg-yellow-500"
                >
                    Sign in for saved address
                </button>

            </div>
        </div>
    );
};

export default Hero;
