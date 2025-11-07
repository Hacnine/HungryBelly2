import React, { useEffect } from 'react'
import Hero from './Hero';
import ContactDetails from './ContactDetails';
import ContactForm from './ContactForm';
import Map from './Map';
import ContactUs from './ContactUs';
import { useLocation } from 'react-router-dom';

const Contact = () => {

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="pb-8 animate__animated animate__fadeIn">
      <div className="animate__animated animate__slideInDown"><Hero /></div>
      <div className="animate__animated animate__fadeInUp"><ContactDetails /></div>
      <div className="animate__animated animate__slideInLeft"><ContactForm /></div>
      <div className="animate__animated animate__slideInRight"><Map /></div>
      <div className="animate__animated animate__zoomIn"><ContactUs /></div>
    </div>
  );
};

export default Contact;
