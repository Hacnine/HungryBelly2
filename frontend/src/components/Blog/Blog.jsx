import React, { useEffect } from 'react'
import Hero from './Hero';
import FeaturedArticles from './FeaturedArticles';
import RecentPosts from './RecentPosts';
import Categories from './Categories';
import Subscription from './Subscription';
import { useLocation } from 'react-router-dom';



const Blog = () => {

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="pb-8 animate__animated animate__fadeIn">
      <div className="animate__animated animate__slideInDown"><Hero /></div>
      <div className="animate__animated animate__fadeInUp"><FeaturedArticles /></div>
      <div className="animate__animated animate__slideInLeft"><RecentPosts /></div>
      <div className="animate__animated animate__slideInRight"><Categories /></div>
      <div className="animate__animated animate__zoomIn"><Subscription /></div>
    </div>
  );
};

export default Blog;
