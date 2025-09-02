import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// --- SVG Icons with color props ---
const DeliveryIcon = ({ className = "h-10 w-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16h2a2 2 0 002-2V7a2 2 0 00-2-2h-3.5a1 1 0 00-.8.4L12 8" />
  </svg>
);
const PaymentIcon = ({ className = "h-10 w-10" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);
const ReturnIcon = ({ className = "h-10 w-10" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.65-5.65l1.35 1.35M20 15a9 9 0 01-14.65 5.65l-1.35-1.35" />
    </svg>
);
const AuthenticIcon = ({ className = "h-10 w-10" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

const InfoCard = ({ icon, title, to, bgColor, iconColor }) => (
  <Link 
    to={to} 
    className="bg-white rounded-xl p-6 text-center flex flex-col items-center justify-center border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
  >
    <div className={`flex items-center justify-center h-20 w-20 rounded-full ${bgColor}`}>
        {React.cloneElement(icon, { className: `h-10 w-10 ${iconColor}` })}
    </div>
    <h3 className="font-semibold text-slate-800 mt-4 text-md">{title}</h3>
  </Link>
);

const DeliveryInfo = () => {
  const { t } = useTranslation();
  const deliveryCards = [
    { icon: <DeliveryIcon />, title: t('fast_delivery'), to: '/delivery-info', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { icon: <PaymentIcon />, title: t('safe_payment'), to: '/payment-info', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { icon: <ReturnIcon />, title: t('easy_return'), to: '/return-policy', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { icon: <AuthenticIcon />, title: t('authentic_products'), to: '/authenticity', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {deliveryCards.map(card => <InfoCard key={card.title} {...card} />)}
      </div>
    </div>
  );
};

export default DeliveryInfo;