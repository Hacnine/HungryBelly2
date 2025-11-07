import React, { useEffect } from 'react'
import Hero from './Hero';
import Story from './Story';
import Values from './Values';
import Testimonials from './Testimonials';
import Gallery from './Gallery';
import { useLocation } from 'react-router-dom';

const About = () => {

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  return (
    <div className=" pb-8 animate__animated animate__fadeIn">
      <div className="animate__animated animate__slideInDown"><Hero /></div>
      <div className="animate__animated animate__fadeInUp"><Story /></div>
      <div className="animate__animated animate__slideInLeft"><Values /></div>
      <div className="animate__animated animate__slideInRight"><Testimonials /></div>
      <div className="animate__animated animate__zoomIn"><Gallery/></div>
    </div>
  );
};

export default About;
