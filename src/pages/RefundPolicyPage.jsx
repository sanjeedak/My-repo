import React from 'react';
import InfoCards from '../components/layout/InfoCards'; // Import the InfoCards component

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 sm:p-10 prose lg:prose-lg max-w-none">
            <h1 className="text-center text-4xl font-extrabold text-slate-800 mb-8">
              ShopZeo Refund & Return Policy
            </h1>

            <p>
              At <strong>ShopZeo</strong>, we aim to provide a seamless shopping experience. If you're not completely satisfied with your purchase, we’ve made our refund and return policy as simple as possible.
            </p>

            <hr className="my-6" />

            <h3><strong>1. Eligibility For Returns & Refunds</strong></h3>
            <p>You are eligible for a return and refund under the following circumstances:</p>
            <ul>
              <li><p>You received a <strong>damaged</strong>, <strong>defective</strong>, or <strong>incorrect product</strong>.</p></li>
              <li><p>The product you received is <strong>significantly different</strong> from what was described or shown on the website.</p></li>
              <li><p>The product is <strong>missing</strong> from your order.</p></li>
              <li><p>The <strong>order was cancelled</strong> before shipment or due to stock issues.</p></li>
            </ul>
            <p>
              <strong>Note:</strong> Some products may not be eligible for returns or refunds, including those marked as &ldquo;<strong>non-returnable</strong>&rdquo; or &ldquo;<strong>final sale</strong>.&rdquo; Returns must be made with the original packaging, and products should be unused.
            </p>

            <hr className="my-6" />

            <h3><strong>2. Refund Process</strong></h3>
            <p>Once a return is initiated and the product is picked up or the issue is confirmed, the refund will be processed through the same payment method used for the original purchase.</p>
            <p><em>*The refund will be processed after quality checks and approval of the return.</em></p>

            <hr className="my-6" />

            <h3><strong>3. Return Process</strong></h3>
            <p>To initiate a return, please contact our customer support team with your order details. Our team will guide you through the return process. Returns are only accepted in cases where the product meets the eligibility criteria mentioned above.</p>

            <hr className="my-6" />

            <h3><strong>4. Refund Timelines</strong></h3>
            <p>Refunds are initiated after the returned product passes the quality check. Once processed, you will receive a notification via email or SMS, and the amount will be credited to your account within <strong>1 to 7 business days</strong>.</p>
            
            <hr className="my-6" />

            <h3><strong>5. Important Notes</strong></h3>
            <ul>
              <li><p><strong>Partial Refunds</strong> may be applicable if only part of the order qualifies for return.</p></li>
              <li><p>If the <strong>delivery is unsuccessful</strong> or the order is canceled before shipment, a full refund will be processed.</p></li>
              <li><p>ShopZeo reserves the right to approve or reject any return and refund request after internal verification.</p></li>
            </ul>

            <hr className="my-6" />

            <h3><strong>6. Contact Us for Assistance</strong></h3>
            <p>If you need any help with returns or refunds, feel free to contact us:</p>
            <p>
              📧 <strong>Email:</strong> <a href="mailto:shopzeo02@gmail.com">shopzeo02@gmail.com</a><br />
              📞 <strong>Phone:</strong> <a href="tel:7348832668">7348832668</a>
            </p>
          </div>
        </div>
      </div>
      <InfoCards />
    </div>
  );
};

export default RefundPolicyPage;

