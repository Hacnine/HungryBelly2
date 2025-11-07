import React, { useState } from 'react'
import featured3 from '../../../assets/images/featured/featured3.jpg';
import foodbg from '../../../assets/images/background/firstfeaturebg.svg';
import Service from './Service';
import MarketExperienceCard from './MarketExperienceCard';

export default function FeaturedTab() {

    const [activeTab, setActiveTab] = useState('about');

    const tabs = [
        { name: 'about', label: 'About' },
        { name: 'experience', label: 'Experience' },
        { name: 'contact', label: 'Contact' },
    ];

    const tabContent = {
        about: (
            <div>
                <h1 data-aos="fadeIn">EXCEPTIONAL CULINARY EXPERIENCE AND DELICIOUS FOOD</h1>
                <p data-aos="fadeInUp" className="text-black font-poppins text-base font-medium mb-4 mb-">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare non sed est cursus. Vel hac convallis ipsum, facilisi odio pellentesque bibendum viverra tempus. Lorem ipsum dolor sit amet consectetur adipiscing elit do eiusmod tempor incididunt ut labore et dolore magna minim veniam nostrud exercitation.</p>


                <div data-aos="slideInUp" className="start gap-4">
                    <button className="bg-yellow-500 text-black px-4 py-2 font-poppins  text-base font-bold">ABOUT MORE</button>

                    <button className="flex items-center gap-2 mt-2">
                        <img src="/icon/call-alt.svg" alt="" />
                        <p className="text-black font-poppins font-bold text-sm">+88 3426 739 485</p>
                    </button>
                </div>
            </div>
        ),
        experience: (
            <div className=''>
                <h1 data-aos="fadeIn">Experience</h1>
                <p data-aos="fadeInUp" className="text-gray-700 mb-4">Experience content goes here. Vel hac convallis ipsum, facilisi odio pellentesque bibendum.</p>
            </div>
        ),
        contact: (
            <div className=''>
                <h1 data-aos="fadeIn">Contact</h1>
                <p data-aos="fadeInUp" className="text-gray-700 mb-4">Contact details can be found here.</p>
            </div>
        ),
    };


    return (
        <div className="bg-white  wrapper container mx-auto   mt-20 ">
            <div className="relative w-fit">
            <MarketExperienceCard/>
            <div className="flex flex-col lg:flex-row md:gap-16 gap-2">
                <div data-aos="slideInLeft" className="lg:w-1/2 ">
                    <img src={featured3} alt="Burger" className="w-full h-auto" />
                </div>
                <div data-aos="slideInRight" className="lg:w-1/2 md:mt-0 mt-7">
                    <nav className="flex space-x-4 mb-4  border-b border-customred">
                        {tabs.map((tab) => (
                            <div
                                key={tab.name}
                              
                                onClick={() => setActiveTab(tab.name)}
                                className={`text-lg font-medium ${activeTab === tab.name ? 'bg-customred  text-white' : 'text-black hover:text-gray-500 cursor-pointer'} px-4 py-2`}
                            >
                                {tab.label}
                            </div>
                        ))}
                    </nav>



                    <div data-aos="fadeInUp" className=" shadow rounded-b-lg p-4 mt-4">
                        {tabContent[activeTab]}
                    </div>
                </div>

            </div>

            <Service/>
            </div>
        </div>
    )
}
