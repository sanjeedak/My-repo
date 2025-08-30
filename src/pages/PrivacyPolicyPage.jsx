import React from 'react';
import InfoCards from '../components/layout/InfoCards'; // Import the InfoCards component

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 sm:p-10 prose lg:prose-lg max-w-none">
            <h1 className="text-center text-4xl font-extrabold text-slate-800 mb-8">
              Privacy Policy for ShopZeo
            </h1>

            <p>
              At ShopZeo, we respect your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, share, and safeguard your information when you use our services via our website or mobile application (collectively, the "Platform").
            </p>

            <hr className="my-6" />

            <h3><strong>1. Acceptance of Policy</strong></h3>
            <p>By accessing or using the Platform, you agree to the terms and conditions of this Privacy Policy and consent to our data practices. If you do not agree, please do not use or access our services.</p>

            <h3><strong>2. Information We Collect</strong></h3>
            <p>We may collect the following types of information:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, phone number, email address, delivery address, payment details, etc.</li>
              <li><strong>Automatically Collected Information:</strong> IP address, device type, browser type, operating system, referring URLs, access times, and usage patterns.</li>
              <li><strong>Cookies and Tracking Technologies:</strong> We use cookies to improve your browsing experience and collect analytics data. Cookies do not contain personally identifiable information.</li>
            </ul>

            <h3><strong>3. How We Use Your Information</strong></h3>
            <p>Your information is used to:</p>
            <ul>
              <li>Process transactions and deliver products</li>
              <li>Communicate with you about orders, offers, or inquiries</li>
              <li>Personalize your experience on the Platform</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Analyze and improve our services</li>
            </ul>

            <h3><strong>4. Sharing of Information</strong></h3>
            <p>We may share your personal information with:</p>
            <ul>
              <li>Service providers (such as logistics and payment partners) to fulfill orders and improve service</li>
              <li>Legal or regulatory authorities when required by law</li>
              <li>Internal affiliates and partners for business and analytical purposes. We do not sell or rent your personal information to third parties.</li>
            </ul>

            <h3><strong>5. Data Security</strong></h3>
            <p>We use appropriate technical and organizational measures to protect your information against unauthorized access, misuse, or disclosure. However, no method of transmission over the internet is completely secure.</p>

            <h3><strong>6. Data Retention</strong></h3>
            <p>Your personal information is retained only for as long as necessary for the purposes stated in this policy or as required by applicable law.</p>

            <h3><strong>7. Your Rights and Choices</strong></h3>
            <p>You may:</p>
            <ul>
              <li>Request access, correction, or deletion of your personal data</li>
              <li>Opt out of receiving marketing emails or messages</li>
              <li>Disable cookies via your browser settings (note that some features may not function properly)</li>
            </ul>

            <h3><strong>8. Third-Party Links</strong></h3>
            <p>Our Platform may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.</p>

            <h3><strong>9. Updates to This Policy</strong></h3>
            <p>We may revise this Privacy Policy from time to time. We encourage you to review it periodically. Continued use of the Platform after changes signifies your consent to the updated policy.</p>

            <h3><strong>10. Contact Us</strong></h3>
            <p>For any questions or concerns about this Privacy Policy or your personal information, contact us at:</p>
            <p>
              <strong>Email:</strong> <a href="mailto:Support@shopzeo.in">Support@shopzeo.in</a>
            </p>

            <hr className="my-6" />
            <p className="text-center">Thank you for trusting ShopZeo!</p>
          </div>
        </div>
      </div>
      <InfoCards />
    </div>
  );
};

export default PrivacyPolicyPage;

