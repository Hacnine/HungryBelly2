import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, user }) => {
    const location = useLocation();

    return (
        <>

            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                ></div>
            )}

            <div
                className={`fixed top-0 z-50 left-0 h-full w-64 bg-hero-bg text-white transform transition-transform duration-300 lg:hidden block ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="between py-6 px-4">
                    <div className="center gap-2">
                        <img src={"/sitelogo.svg"} className='w-12' alt="Site Logo" />
                        <p className="text-xl font-poppins">Restaurant</p>
                    </div>
                    <button onClick={onClose} className="text-white text-2xl">
                        &times;
                    </button>
                </div>
                {user && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-hero-bg text-white border-b border-gray-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{user.name}</span>
                    </div>
                )}
                <nav className="flex flex-col items-start p-4 space-y-4 bg-yellow-400 h-full text-gray-100">
                    <Link to={'/'} className={`border-b-2 ${location.pathname === '/' ? " border-customred" : " border-transparent"} font-semibold hover:text-customred `}>Home</Link>
                    <Link to={'/about'} className={`border-b-2 ${location.pathname === '/about' ? " border-customred" : " border-transparent"} hover:text-customred font-semibold`}>About</Link>
                    <Link to={'/portfolio'} className={`border-b-2 ${location.pathname === '/portfolio' ? " border-customred" : " border-transparent"} hover:text-customred font-semibold`}>Portfolio</Link>
                    <Link to={'/client'} className={`border-b-2 ${location.pathname === '/client' ? " border-customred" : " border-transparent"} hover:text-customred font-semibold`}>Clients</Link>
                    <Link to={'/blog'} className={`border-b-2 ${location.pathname === '/blog' ? " border-customred" : " border-transparent"} hover:text-customred font-semibold`}>Blog</Link>
                    <Link to={'/contact'} className={`border-b-2 ${location.pathname === '/contact' ? " border-customred" : " border-transparent"} hover:text-customred font-semibold`}>Contact</Link>
                    <Link to={'/profile'} className={`border-b-2 ${location.pathname === '/profile' ? " border-customred" : " border-transparent"} hover:text-customred font-semibold`}>Profile</Link>
                    {user?.role === 'admin' && (
                        <Link to={'/admin'} className={`border-b-2 ${location.pathname === '/admin' ? " border-customred" : " border-transparent"} hover:text-customred font-semibold`}>Admin</Link>
                    )}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
