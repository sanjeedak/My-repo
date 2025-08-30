import React from 'react';
import InfoCards from '../components/layout/InfoCards'; // Import the InfoCards component

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 sm:p-10 prose lg:prose-lg max-w-none">
            <h1 className="text-center text-4xl font-extrabold text-slate-800 mb-8">
              Terms Of Use For ShopZeo
            </h1>

            <p>
              Welcome to ShopZeo! These Terms of Use ("Terms") govern your access to and use of the ShopZeo website, mobile application, and services (collectively, the "Platform"). By accessing or using ShopZeo, you agree to be bound by these Terms.
            </p>

            <hr className="my-6" />

            <h3><strong>1. User Eligibility</strong></h3>
            <p>You must be at least 18 years of age and capable of entering into a legally binding agreement under Indian law to use the Platform. By using ShopZeo, you represent and warrant that you meet this requirement.</p>

            <h3><strong>2. Account Registration</strong></h3>
            <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must provide accurate and complete information when creating an account.</p>

            <h3><strong>3. Platform Usage</strong></h3>
            <p>You agree to use the Platform only for lawful purposes. You shall not:</p>
            <ul>
              <li>Post or share misleading, harmful, or illegal content;</li>
              <li>Interfere with the functionality of the Platform;</li>
              <li>Use bots, scrapers, or other automated tools to extract data;</li>
              <li>Attempt unauthorized access to the Platform or user data;</li>
              <li>Violate any applicable local, state, national, or international law.</li>
            </ul>

            <h3><strong>4. Product Listings and Purchases</strong></h3>
            <p>All product listings, descriptions, and prices are subject to change. We strive to display accurate information, but we do not warrant that product descriptions or other content are accurate, complete, reliable, or error-free. Your order is an offer to purchase, which we may accept or reject.</p>

            <h3><strong>5. Payments</strong></h3>
            <p>ShopZeo uses secure third-party payment gateways. You agree to pay all charges incurred by you at the prices in effect when such charges are incurred, including any applicable taxes.</p>

            <h3><strong>6. Returns and Refunds</strong></h3>
            <p>Returns and refunds are subject to ShopZeo’s Return Policy. Please refer to the Return Policy section on our Platform for details.</p>

            <h3><strong>7. Intellectual Property</strong></h3>
            <p>All content on the Platform, including text, graphics, logos, images, and software, is the property of ShopZeo or its licensors and is protected under applicable intellectual property laws. You may not copy, modify, distribute, or use any content without written permission.</p>

            <h3><strong>8. User-Generated Content</strong></h3>
            <p>If you submit any content (e.g., reviews, ratings), you grant ShopZeo a non-exclusive, royalty-free, perpetual license to use, reproduce, modify, and publish such content.</p>

            <h3><strong>9. Limitation of Liability</strong></h3>
            <p>ShopZeo is not liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the Platform or any products purchased through it.</p>

            <h3><strong>10. Indemnification</strong></h3>
            <p>You agree to indemnify and hold harmless ShopZeo, its officers, employees, and affiliates from any claims, damages, or losses arising out of your use of the Platform or your violation of these Terms.</p>

            <h3><strong>11. Privacy</strong></h3>
            <p>Please review our Privacy Policy to understand our practices regarding your personal data.</p>

            <h3><strong>12. Modifications</strong></h3>
            <p>We may update these Terms from time to time. Continued use of the Platform constitutes your acceptance of the revised Terms.</p>

            <h3><strong>13. Governing Law and Jurisdiction</strong></h3>
            <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in Hyderabad, Telangana.</p>

            <hr className="my-6" />
            <p className="text-center">Thank you for choosing ShopZeo!</p>
          </div>
        </div>
      </div>
      <InfoCards />
    </div>
  );
};

export default TermsPage;

