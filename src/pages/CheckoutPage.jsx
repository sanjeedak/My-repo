import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CreditCard, ShieldCheck, Truck, RefreshCw, Shield, ThumbsUp } from 'lucide-react';
import MapSection from '../components/MapSection'; // Naye Map component ko import karein

// --- Form Components ---
const InputField = ({ id, label, type = 'text', value, onChange, placeholder, required = true, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
    <div className="relative">
      {children}
      <input
        type={type} id={id} name={id} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className={`w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${children ? 'pl-12' : ''}`}
      />
    </div>
  </div>
);

const SelectField = ({ id, label, value, onChange, required = true, children }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
      <select id={id} name={id} value={value} onChange={onChange} required={required} className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
        {children}
      </select>
    </div>
);

// --- Stepper Component ---
const CheckoutStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Cart' },
    { id: 2, name: 'Shipping And Billing' },
    { id: 3, name: 'Payment' }
  ];

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center border border-gray-200 rounded-md p-4 bg-white">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            <div className="flex items-center text-sm font-medium">
              <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${currentStep >= step.id ? 'bg-blue-600 text-white' : 'border-2 border-gray-300 text-gray-500'}`}>
                {currentStep > step.id ? <ShieldCheck className="w-5 h-5"/> : <span>{step.id}</span>}
              </span>
              <span className={`ml-4 hidden sm:block ${currentStep >= step.id ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>{step.name}</span>
            </div>
            {stepIdx !== steps.length - 1 ? (
              <div className={`absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'}`} aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// --- Order Summary Component ---
const OrderSummary = ({ cartItems, onProceed, step }) => {
    const navigate = useNavigate();
    const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [cartItems]);
    const tax = useMemo(() => subtotal * 0.05, [subtotal]);
    const shipping = subtotal > 500 ? 0 : 50;
    const discount = 0.00; // Placeholder
    const total = useMemo(() => subtotal + tax + shipping - discount, [subtotal, tax, shipping, discount]);
    
    const infoItems = [
        { icon: <Truck className="w-6 h-6 text-gray-500"/>, text: "Fast Delivery" },
        { icon: <Shield className="w-6 h-6 text-gray-500"/>, text: "Safe Payment" },
        { icon: <RefreshCw className="w-6 h-6 text-gray-500"/>, text: "7 Days Return" },
        { icon: <ThumbsUp className="w-6 h-6 text-gray-500"/>, text: "100% Authentic" }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow sticky top-24">
            <h3 className="text-lg font-bold border-b pb-3 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Sub total:</span><span className="font-medium">₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Tax:</span><span className="font-medium">₹{tax.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping:</span><span className="font-medium">₹{shipping.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Discount on product:</span><span className="font-medium">- ₹{discount.toFixed(2)}</span></div>
            </div>
            <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center mt-6 border-t pt-4">
                {infoItems.map(item => (
                    <div key={item.text} className="flex flex-col items-center">
                        {item.icon}
                        <span className="text-xs mt-1 text-gray-600">{item.text}</span>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <button onClick={onProceed} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                    {step === 2 ? 'Proceed to Checkout' : 'Place Order'}
                </button>
            </div>
            <div className="text-center mt-4">
                <button onClick={() => navigate('/products')} className="text-sm text-gray-600 hover:underline">
                    &lt; Continue Shopping
                </button>
            </div>
        </div>
    );
}

// --- Main Checkout Page ---
const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(2);
  const [shippingInfo, setShippingInfo] = useState({
    name: '', phone: '', email: '', addressType: 'permanent', country: 'India', city: '', pincode: '', address: '', state: ''
  });
  const [billingInfo, setBillingInfo] = useState({
    name: '', phone: '', email: '', addressType: 'permanent', country: 'India', city: '', pincode: '', address: '', state: ''
  });
  const [useSameAsShipping, setUseSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    if (useSameAsShipping) {
      setBillingInfo(shippingInfo);
    }
  }, [shippingInfo, useSameAsShipping]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceed = () => {
    if (step === 2) {
      const requiredFields = ['name', 'phone', 'email', 'address', 'city', 'pincode', 'state', 'country'];
      for (const field of requiredFields) {
        if (!shippingInfo[field]) {
          alert(`Please fill out the shipping field: ${field.replace(/([A-Z])/g, ' $1')}`);
          return;
        }
      }
      if (!useSameAsShipping) {
        for (const field of requiredFields) {
            if (!billingInfo[field]) {
                alert(`Please fill out the billing field: ${field.replace(/([A-Z])/g, ' $1')}`);
                return;
            }
        }
      }
      setStep(3);
    } else if (step === 3) {
      console.log("Placing order with:", { shippingInfo, billingInfo, paymentMethod });
      clearCart();
      navigate('/order-success');
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Aapka cart khali hai</h2>
        <button onClick={() => navigate('/products')} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Shopping Jari Rakhein</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
            <CheckoutStepper currentStep={step}/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow space-y-8">
            
            {step === 2 && (
              <>
                {/* --- SHIPPING ADDRESS --- */}
                <section>
                    <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField id="name" label="Contact person name" name="name" value={shippingInfo.name} onChange={handleShippingChange} />
                        <InputField id="phone" label="Phone" name="phone" type="tel" value={shippingInfo.phone} onChange={handleShippingChange}>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><span className="text-gray-500 text-sm">+91</span></div>
                        </InputField>
                        <InputField id="email" label="Email" name="email" type="email" value={shippingInfo.email} onChange={handleShippingChange} />
                        <SelectField id="addressType" label="Address type" name="addressType" value={shippingInfo.addressType} onChange={handleShippingChange}>
                            <option value="permanent">Permanent</option>
                            <option value="home">Home</option>
                            <option value="office">Office</option>
                        </SelectField>
                        <SelectField id="country" label="Country" name="country" value={shippingInfo.country} onChange={handleShippingChange}>
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                        </SelectField>
                        <InputField id="city" label="City" name="city" value={shippingInfo.city} onChange={handleShippingChange} />
                        <InputField id="pincode" label="Zip code" name="pincode" value={shippingInfo.pincode} onChange={handleShippingChange} />
                         <InputField id="state" label="State" name="state" value={shippingInfo.state} onChange={handleShippingChange} />
                        <div className="md:col-span-2">
                            <InputField id="address" label="Address" name="address" value={shippingInfo.address} onChange={handleShippingChange} />
                        </div>
                    </div>
                </section>

                <MapSection />
                
                 <div className="flex items-center">
                    <input type="checkbox" id="create-account" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label htmlFor="create-account" className="ml-2 text-sm text-gray-700">Create an account with the above info</label>
                </div>

                 {/* --- BILLING ADDRESS --- */}
                 <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Billing Address</h2>
                        <label className="flex items-center">
                            <input type="checkbox" checked={useSameAsShipping} onChange={(e) => setUseSameAsShipping(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-700">Same as shipping address</span>
                        </label>
                    </div>
                    {!useSameAsShipping && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField id="billing_name" label="Contact person name" name="name" value={billingInfo.name} onChange={handleBillingChange} />
                            <InputField id="billing_phone" label="Phone" name="phone" type="tel" value={billingInfo.phone} onChange={handleBillingChange}>
                                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><span className="text-gray-500 text-sm">+91</span></div>
                            </InputField>
                            <InputField id="billing_email" label="Email" name="email" type="email" value={billingInfo.email} onChange={handleBillingChange} />
                            <SelectField id="billing_addressType" label="Address type" name="addressType" value={billingInfo.addressType} onChange={handleBillingChange}>
                                <option value="permanent">Permanent</option>
                                <option value="home">Home</option>
                                <option value="office">Office</option>
                            </SelectField>
                            <SelectField id="billing_country" label="Country" name="country" value={billingInfo.country} onChange={handleBillingChange}>
                                <option value="India">India</option>
                                <option value="USA">USA</option>
                            </SelectField>
                            <InputField id="billing_city" label="City" name="city" value={billingInfo.city} onChange={handleBillingChange} />
                            <InputField id="billing_pincode" label="Zip code" name="pincode" value={billingInfo.pincode} onChange={handleBillingChange} />
                             <InputField id="billing_state" label="State" name="state" value={billingInfo.state} onChange={handleBillingChange} />
                             <div className="md:col-span-2">
                                <InputField id="billing_address" label="Address" name="address" value={billingInfo.address} onChange={handleBillingChange} />
                            </div>
                        </div>
                    )}
                </section>
              </>
            )}

            {step === 3 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CreditCard /> Payment Method</h2>
                    <div className="space-y-4">
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                            <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-blue-600"/>
                            <span className="ml-3 font-medium">Cash on Delivery (COD)</span>
                        </label>
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'digital' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                            <input type="radio" name="paymentMethod" value="digital" checked={paymentMethod === 'digital'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-blue-600"/>
                            <span className="ml-3 font-medium">Digital Payment</span>
                            <span className="ml-auto text-sm text-gray-500">(Credit/Debit Card, UPI)</span>
                        </label>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                        <button onClick={() => setStep(2)} className="text-sm text-gray-600 hover:underline">← Back to Shipping</button>
                    </div>
                </div>
            )}
          </div>

          <div className="lg:col-span-1">
             <OrderSummary cartItems={cartItems} onProceed={handleProceed} step={step} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

