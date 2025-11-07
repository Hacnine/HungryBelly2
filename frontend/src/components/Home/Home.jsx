import React, { useEffect } from 'react'
import FeaturedTab from './Featured/FeaturedTab'
import BookingForm from './BookingForm/BookingForm'
import Hero from './Hero'
import CommentarySlider from './CustomerSay/CommentarySlider'
import FoodItemSlider from './PopularFoodItems/FoodItemSlider'
import { useLocation } from 'react-router-dom'

export default function Home() {

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  return (
    <div>
      <Hero />
      <div data-aos="fadeInUp"><FeaturedTab /></div>
      <div data-aos="slideInLeft"><FoodItemSlider /></div>
      <div data-aos="slideInRight"><BookingForm /></div>
      <div data-aos="fadeInUp"><CommentarySlider /></div>
    </div>
  )
}
