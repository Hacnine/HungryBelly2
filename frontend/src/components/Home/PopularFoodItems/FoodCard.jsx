import React from 'react';
import { useOrder } from '../../../context/OrderContext';
import { Link } from 'react-router-dom';

const FoodCard = ({ product, name, description, image, price, index }) => {
  const { addOrder } = useOrder();
  return (
    <div data-aos="fadeInUp" data-aos-delay={(index % 4) * 250} className="relative bg-white group hover:cursor-pointer px-2 py-3 mx-2 shadow-md flex flex-col items-center justify-center sm:w-[240px] sm:h-[240px] w-[306px] h-[300px]" key={index}>
      <img src={image} alt={name} className="w-24 h-24 object-cover rounded-full" />
      <div className="w-9 h-1 my-3 bg-customred"></div>
      <h3 className="text-lg font-bebus">{name}</h3>
      <p className="font-semibold text-xs font-poppins">{description}</p>

      {/* Order Now overlay sliding from bottom */}
      <Link to={'/order'} className="absolute -bottom-1 left-0 right-0 bg-customred flex items-center justify-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out h-[40%] flex-col"  onClick={() =>  addOrder(product)} >
        <span className=' font-bebus text-yellow-500 '>$ {price} </span>
        <span className="text-white font-bebus text-sm tracking-wider border-2 px-2 py-1">Order Now</span>
      </Link>
    </div>
  );
};

export default FoodCard;
