import React from 'react';
import { useTranslation } from 'react-i18next';

const ContactUsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 sm:p-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-slate-800">{t('get_in_touch')}</h1>
            <p className="mt-2 text-md text-gray-500">
              {t('get_in_touch_desc')}
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 rounded-lg">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{t('email')}</h3>
                <p className="text-gray-600">{t('email_desc')}</p>
                <a href="mailto:support@company.com" className="text-blue-600 hover:underline">support@shopzeo.in</a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 rounded-lg">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{t('phone')}</h3>
                <p className="text-gray-600">{t('phone_desc')}</p>
                <a href="tel:+91-9876543210" className="text-blue-600 hover:underline">+91-9876543210</a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 rounded-lg">
                <span className="text-2xl">🏢</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{t('address')}</h3>
                <p className="text-gray-600">2447,16th B Main, Kodihalli, HAL 2nd Stage, Bangalore-560008, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;