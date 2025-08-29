import React, { useState } from 'react';

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div className="border-b">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center text-left py-4 px-2 focus:outline-none"
    >
      <span className="text-lg font-medium text-gray-800">{faq.question}</span>
      <svg
        className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isOpen && (
      <div className="px-2 pb-4 text-gray-600">
        <p>{faq.answer}</p>
      </div>
    )}
  </div>
);

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How can I create an account?',
      answer: 'You can sign up using your email ID and phone number directly on our platform.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is placed, you can track it from your profile under \'My Orders\'.',
    },
    {
      question: 'How do I return a product?',
      answer: 'You can request a return directly from the app within 7 days of delivery.',
    },
  ];
  
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-slate-800">Frequently Asked Questions</h1>
            <p className="mt-2 text-md text-gray-500">
              We understand that you may have questions. Here are some of the most common queries and their answers.
            </p>
          </div>
          <div className="mt-8">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                faq={faq} 
                isOpen={openIndex === index}
                onToggle={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;