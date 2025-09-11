import React from 'react';
import { useTranslation } from 'react-i18next';

const AppPromotion = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 p-8 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">{t('download_our_app')}</h2>
                        <p className="text-gray-600 mb-6">{t('subscribe_text')}</p>
                        <div className="flex justify-center md:justify-start gap-4">
                            <a href="https://play.google.com/store/apps" target="_blank" rel="noopener noreferrer">
                                <img src="/img/googleplay.jpeg" alt="Google Play" className="h-12 transition-transform hover:scale-105" />
                            </a>
                            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                                <img src="/img/appstore.jpeg" alt="App Store" className="h-12 transition-transform hover:scale-105" />
                            </a>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center p-8">
                        {/* You can add a phone mockup image here for better visuals at public/img/phone-mockup.png */}
                        <img src="/img/phone-mockup.png" alt="Shopzeo App" className="max-h-64" onError={(e) => e.target.style.display = 'none'}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppPromotion;