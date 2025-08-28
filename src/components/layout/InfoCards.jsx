import React from 'react';
import { Link } from 'react-router-dom';

// --- SVG Icons for Company Info ---
const AboutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);
const ContactIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" />
  </svg>
);
const FaqIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const BlogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m0 0h2m-2 0V3" />
  </svg>
);

const InfoCard = ({ icon, title, description, to }) => (
  <Link 
    to={to} 
    className="bg-white rounded-lg p-6 text-center flex flex-col items-center justify-center hover:shadow-lg shadow-sm border transition-shadow"
  >
    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-100">
        {icon}
    </div>
    <h3 className="font-bold text-gray-800 mt-4">{title}</h3>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </Link>
);

const InfoCards = () => {
  const companyCards = [
    { icon: <AboutIcon />, title: 'About us', description: 'Know about our company more.', to: '/about' },
    { icon: <ContactIcon />, title: 'Contact Us', description: 'We are Here to Help', to: '/contact' },
    { icon: <FaqIcon />, title: 'FAQ', description: 'Get all Answers', to: '/faq' },
    { icon: <BlogIcon />, title: 'Blog', description: 'Check Latest Blogs', to: '/blog' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {companyCards.map(card => <InfoCard key={card.title} {...card} />)}
      </div>
    </div>
  );
};

export default InfoCards;