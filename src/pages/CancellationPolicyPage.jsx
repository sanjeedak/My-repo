import React from 'react';
import InfoCards from '../components/layout/InfoCards'; // Import the InfoCards component

const CancellationPolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 sm:p-10 prose lg:prose-lg max-w-none">
            <h1 className="text-center text-4xl font-extrabold text-slate-800 mb-8">
              ShopZeo Cancellation Policy
            </h1>

            <p>
              At <strong>ShopZeo</strong>, we understand that sometimes plans change. If you need to cancel an order, we’ve made the process as simple as possible. Please read our Cancellation Policy below.
            </p>

            <hr className="my-6" />

            <h3><strong>1. Cancellation Before Shipment</strong></h3>
            <p>
              You can cancel your order <strong>for free</strong> at any time before it has been shipped. If your order has not yet been dispatched, you can cancel it directly from your account or by contacting our customer service team.
            </p>
            <ul>
              <li>
                <p><strong>How to cancel:</strong></p>
                <ul>
                  <li>
                    <p>Visit your account and go to your order history.</p>
                  </li>
                  <li>
                    <p>Select the order you wish to cancel and choose "Cancel Order."</p>
                  </li>
                  <li>
                    <p>Alternatively, contact our customer support team via email or phone for assistance.</p>
                  </li>
                </ul>
              </li>
            </ul>
            <p>
              Once the cancellation is successfully processed, you will receive a confirmation email, and the amount will be refunded to the original payment method.
            </p>

            <hr className="my-6" />

            <h3><strong>2. Cancellation After Shipment</strong></h3>
            <p>
              Once your order has been shipped or is out for delivery, it can no longer be canceled. However, if you do not wish to accept the delivery, you can reject the product at the time of delivery. In such cases, the product will be returned to us, and a refund will be initiated as per our <strong>Refund Policy</strong>.
            </p>

            <hr className="my-6" />

            <h3><strong>3. Partial Cancellations</strong></h3>
            <p>
              If your order contains multiple items, you may be able to cancel certain items individually (if they have not been shipped yet). For any cancellations, please refer to the steps mentioned above. If part of your order is canceled, the refund for that item will follow the same process as a full order cancellation.
            </p>

            <hr className="my-6" />

            <h3><strong>4. Cancellations Due to Stock Issues</strong></h3>
            <p>
              In rare cases, if we are unable to fulfill your order due to stock unavailability or other unforeseen circumstances, we will notify you immediately, and the order will be canceled. In this case, a full refund will be processed to your original payment method.
            </p>

            <hr className="my-6" />

            <h3><strong>5. Non-Cancelable Orders</strong></h3>
            <p>
              Certain products, like those marked as "<strong>final sale</strong>" or "<strong>non-returnable</strong>," cannot be canceled after the order is placed.
            </p>

            <hr className="my-6" />

            <h3><strong>6. Contact Us for Cancellation Assistance</strong></h3>
            <p>
              If you need help with canceling an order, please reach out to our customer service team:
            </p>
            <p>
              📧 <strong>Email:</strong> <a href="mailto:Support@shopzeo.in">Support@shopzeo.in</a>
            </p>
          </div>
        </div>
      </div>
      <InfoCards />
    </div>
  );
};

export default CancellationPolicyPage;

