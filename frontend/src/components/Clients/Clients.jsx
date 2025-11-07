import React, { useEffect } from 'react'
import Hero from './Hero';
import ClientLogos from './ClientLogos';
import Testimonials from './Testimonials';
import ClientExperience from './ClientExperience';
import Contact from './Contact';
import { useLocation } from 'react-router-dom';


const Clients = () => {

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="pb-8 animate__animated animate__fadeIn">
      <div className="animate__animated animate__slideInDown"><Hero /></div>
      <div className="animate__animated animate__fadeInUp"><ClientLogos /></div>
      <div className="animate__animated animate__slideInLeft"><Testimonials /></div>
      <div className="animate__animated animate__slideInRight"><ClientExperience /></div>
      <div className="animate__animated animate__zoomIn"><Contact /></div>
    </div>
  );
};

export default Clients;
