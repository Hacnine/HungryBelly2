import React from 'react';

const items = [
  { img:"/icon/package.svg", title: 'Fast Delivery', description: 'Within 30 minutes' },
  { img:"/icon/medal.svg", title: 'Absolute Dinning', description: 'Best buffer restaurats' },
  { img:"/icon/bag.svg", title: 'Pickup Delivery', description: 'Grab your food order' },
  // Add more items as needed
];

const Service = () => {
  return (
    <div className="container mx-auto md:mt-14 mt-10 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div data-aos="fadeInUp" data-aos-delay={index * 200} key={index} className="bg-white  py-4 rounded-lg flex items-center justify-start gap-4">
            <div className='shadow-md size-16 center shadow-gray-300 rounded-full p-4'><img src={item.img}  alt="" /></div>
            
            <div>
            <h3 className="text-2xl font-bebus mb-2">{item.title}</h3>
            <p className="text-black  font-medium font-poppins text-base">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
