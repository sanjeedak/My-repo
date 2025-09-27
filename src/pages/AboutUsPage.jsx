import React from 'react';
import InfoCards from '../components/layout/InfoCards'; 
import { useTranslation } from 'react-i18next';

const StoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const MissionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.49l-1.955 1.955a11.978 11.978 0 01-1.414 1.414l-1.955-1.955a11.978 11.978 0 011.414-1.414zM18.496 18.496l-1.955-1.955a11.978 11.978 0 00-1.414-1.414l1.955 1.955a11.978 11.978 0 001.414 1.414zM6.343 18.496l1.955-1.955a11.978 11.978 0 01-1.414-1.414l-1.955 1.955a11.978 11.978 0 011.414 1.414zM5.04 6.343l1.955 1.955a11.978 11.978 0 00-1.414 1.414L3.62 7.757a11.978 11.978 0 001.414-1.414zM12 15a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

const ValuesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" />
  </svg>
);


const AboutUsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-extrabold text-slate-800">
              {t('about_shopzeo')}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              {t('about_intro')}
            </p>
          </div>

          {/* Detailed Content Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 space-y-10">
            {/* Our Story */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <StoryIcon />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-700">{t('our_story')}</h2>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {t('our_story_desc')}
                </p>
              </div>
            </div>
            
            {/* Our Mission */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <MissionIcon />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-700">{t('our_mission')}</h2>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {t('our_mission_desc')}
                </p>
              </div>
            </div>

            {/* Our Values */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <ValuesIcon />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-700">{t('our_values')}</h2>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {t('our_values_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InfoCards />
    </div>
  );
};

export default AboutUsPage;