import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-800 mt-4">
                About Shopzeo
              </h1>
              <p className="mt-2 text-md text-gray-500">
                Making business simple, efficient, and customer-friendly.
              </p>
            </div>
            
            <div className="mt-8 text-lg text-gray-700 leading-relaxed space-y-4 text-justify">
              <p>
                Welcome to our company! We are dedicated to providing the best services and solutions to our customers. Our journey started with the vision of making business simple, efficient, and customer-friendly.
              </p>
              <p>
                We believe in transparency, innovation, and customer satisfaction. Know more about our values, mission, and the story that drives us every day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;