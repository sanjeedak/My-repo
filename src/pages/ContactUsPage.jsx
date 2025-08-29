import React from 'react';

const ContactUsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 sm:p-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-slate-800">Get In Touch</h1>
            <p className="mt-2 text-md text-gray-500">
              We are here to help you. Whether you have queries, feedback, or require support, our team is always ready to assist you.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 rounded-lg">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                <p className="text-gray-600">Please reach out to us through the following email:</p>
                <a href="mailto:support@company.com" className="text-blue-600 hover:underline">support@company.com</a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 rounded-lg">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                <p className="text-gray-600">You can call us directly at:</p>
                <a href="tel:+91-9876543210" className="text-blue-600 hover:underline">+91-9876543210</a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 rounded-lg">
                <span className="text-2xl">🏢</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                <p className="text-gray-600">123 Business Street, City, State, Country</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;