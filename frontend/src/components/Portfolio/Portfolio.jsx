import React, { useEffect } from 'react';
import Hero from './Hero';
import FeaturedDishes from './FeaturedDishes.jsx';
import ChefSpecialities from './ChefSpecialities.jsx';
import EventCatering from './EventCatering.jsx';
import Testimonials from './Testimonials.jsx';
import { useLocation } from 'react-router-dom';


const Portfolio = () => {

  
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="pb-8 animate__animated animate__fadeIn">
      <div className="animate__animated animate__slideInDown"><Hero /></div>
      <div className="animate__animated animate__fadeInUp"><FeaturedDishes /></div>
      <div className="animate__animated animate__slideInLeft"><ChefSpecialities /></div>
      <div className="animate__animated animate__slideInRight"><EventCatering /></div>
      <div className="animate__animated animate__zoomIn"><Testimonials /></div>
    </div>
  );
};

export default Portfolio;
