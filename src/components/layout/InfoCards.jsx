import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// --- SVG Icons with color props ---
const AboutIcon = ({ className = "h-10 w-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);
const ContactIcon = ({ className = "h-10 w-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" />
  </svg>
);
const FaqIcon = ({ className = "h-10 w-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const BlogIcon = ({ className = "h-10 w-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m0 0h2m-2 0V3" />
  </svg>
);

const InfoCard = ({ icon, title, description, to, bgColor, iconColor }) => (
  <Link 
    to={to} 
    className="group bg-white rounded-xl p-6 text-center flex flex-col items-center justify-center border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
  >
    <div className={`flex items-center justify-center h-20 w-20 rounded-full ${bgColor} transition-all duration-300 group-hover:scale-110`}>
        {React.cloneElement(icon, { className: `h-10 w-10 ${iconColor}` })}
    </div>
    <h3 className="font-bold text-slate-800 mt-5 text-lg">{title}</h3>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </Link>
);

const InfoCards = () => {
  const { t } = useTranslation();
  const companyCards = [
    { icon: <AboutIcon />, title: t('about_us'), description: t('know_about_company'), to: '/about', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { icon: <ContactIcon />, title: t('contact_us'), description: t('here_to_help'), to: '/contact', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { icon: <FaqIcon />, title: t('faq'), description: t('get_all_answers'), to: '/faq', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { icon: <BlogIcon />, title: t('blog'), description: t('check_our_latest_blogs'), to: '/blog', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {companyCards.map(card => <InfoCard key={card.title} {...card} />)}
      </div>
    </div>
  );
};

export default InfoCards;