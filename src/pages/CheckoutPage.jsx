import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import MapSection from '../components/MapSection';
import { validateEmailPhone } from '../utils/sanatize';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingForm, setShippingForm] = useState({
    name: '', phone: '', address: '', city: '', state: '', country: '', pincode: ''
  });
  
  const [billingForm, setBillingForm] = useState({
    name: '', phone: '', address: '', city: '', state: '', country: '', pincode: ''
  });

  const [shippingLocation, setShippingLocation] = useState({ lat: 17.3850, lng: 78.4867 });
  const [billingLocation, setBillingLocation] = useState({ lat: 17.3850, lng: 78.4867 });
  const [isShippingGeocoding, setIsShippingGeocoding] = useState(false);
  const [isBillingGeocoding, setIsBillingGeocoding] = useState(false);

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSameAsShippingChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsShipping(isChecked);
    if (isChecked) {
      setBillingForm(shippingForm);
      setBillingLocation(shippingLocation);
    } else {
      // When unchecked, initialize the billing location with the current shipping location
      // This prevents the map from resetting unexpectedly.
      setBillingLocation(shippingLocation);
    }
  };
  
  // Syncs billing form if the shipping form changes AND the checkbox is ticked.
  useEffect(() => {
    if (sameAsShipping) {
      setBillingForm(shippingForm);
    }
  }, [shippingForm, sameAsShipping]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingForm.name.trim()) newErrors.shipping_name = 'Full name is required.';
    const shippingPhoneError = validateEmailPhone(shippingForm.phone, false);
    if (shippingPhoneError) newErrors.shipping_phone = shippingPhoneError;
    if (!shippingForm.address.trim()) newErrors.shipping_address = 'Address is required.';
    if (!shippingForm.city.trim()) newErrors.shipping_city = 'City is required.';
    if (!/^\d{6}$/.test(shippingForm.pincode)) newErrors.shipping_pincode = 'Pincode must be 6 digits.';

    if (!sameAsShipping) {
      if (!billingForm.name.trim()) newErrors.billing_name = 'Full name is required.';
      const billingPhoneError = validateEmailPhone(billingForm.phone, false);
      if (billingPhoneError) newErrors.billing_phone = billingPhoneError;
      if (!billingForm.address.trim()) newErrors.billing_address = 'Address is required.';
      if (!billingForm.city.trim()) newErrors.billing_city = 'City is required.';
      if (!/^\d{6}$/.test(billingForm.pincode)) newErrors.billing_pincode = 'Pincode must be 6 digits.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingAddressSelect = (address) => {
    setShippingForm(prev => ({ ...prev, ...address }));
  };

  const handleBillingAddressSelect = (address) => {
    setBillingForm(prev => ({ ...prev, ...address }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const mockOrderId = `SHPZ${Date.now().toString().slice(-6)}`;
      
      console.log("Order Placed:", {
        orderId: mockOrderId,
        shippingDetails: { ...shippingForm, location: shippingLocation },
        billingDetails: sameAsShipping ? { ...shippingForm, location: shippingLocation } : { ...billingForm, location: billingLocation },
        paymentMethod,
        items: cartItems,
        total,
      });

      clearCart();
      navigate('/order-success', { state: { orderId: mockOrderId } });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Checkout Form */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          {/* Shipping Address */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <input type="text" name="name" placeholder="Full Name" value={shippingForm.name} onChange={handleShippingChange} className={`w-full border px-4 py-2 rounded ${errors.shipping_name ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.shipping_name && <p className="text-red-500 text-xs">{errors.shipping_name}</p>}
              <input type="tel" name="phone" placeholder="Phone Number" value={shippingForm.phone} onChange={handleShippingChange} className={`w-full border px-4 py-2 rounded ${errors.shipping_phone ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.shipping_phone && <p className="text-red-500 text-xs">{errors.shipping_phone}</p>}
              <textarea name="address" placeholder="Full Address" value={shippingForm.address} onChange={handleShippingChange} className={`w-full border px-4 py-2 rounded ${errors.shipping_address ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.shipping_address && <p className="text-red-500 text-xs">{errors.shipping_address}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input type="text" name="city" placeholder="City" value={shippingForm.city} onChange={handleShippingChange} className={`w-full border px-4 py-2 rounded ${errors.shipping_city ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.shipping_city && <p className="text-red-500 text-xs">{errors.shipping_city}</p>}
                </div>
                <div>
                  <input type="text" name="pincode" placeholder="Pincode" value={shippingForm.pincode} onChange={handleShippingChange} className={`w-full border px-4 py-2 rounded ${errors.shipping_pincode ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.shipping_pincode && <p className="text-red-500 text-xs">{errors.shipping_pincode}</p>}
                </div>
              </div>
              <h3 className="text-xl font-semibold pt-4 flex items-center gap-2">
                Confirm Your Shipping Location
                {isShippingGeocoding && <span className="text-sm text-gray-500">(Fetching address...)</span>}
              </h3>
              <MapSection 
                key="shipping-map" 
                onLocationChange={setShippingLocation} 
                onAddressSelect={handleShippingAddressSelect}
                onGeocodingStart={() => setIsShippingGeocoding(true)}
                onGeocodingEnd={() => setIsShippingGeocoding(false)}
              />
            </div>
          </div>
          
          {/* Billing Address */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Billing Address</h2>
            <div className="flex items-center mb-4">
              <input type="checkbox" id="sameAsShipping" checked={sameAsShipping} onChange={handleSameAsShippingChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-900">Billing address is the same as shipping address</label>
            </div>
            {!sameAsShipping && (
              <div className="space-y-4">
                <input type="text" name="name" placeholder="Full Name" value={billingForm.name} onChange={handleBillingChange} className={`w-full border px-4 py-2 rounded ${errors.billing_name ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.billing_name && <p className="text-red-500 text-xs">{errors.billing_name}</p>}
                <input type="tel" name="phone" placeholder="Phone Number" value={billingForm.phone} onChange={handleBillingChange} className={`w-full border px-4 py-2 rounded ${errors.billing_phone ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.billing_phone && <p className="text-red-500 text-xs">{errors.billing_phone}</p>}
                <textarea name="address" placeholder="Full Address" value={billingForm.address} onChange={handleBillingChange} className={`w-full border px-4 py-2 rounded ${errors.billing_address ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.billing_address && <p className="text-red-500 text-xs">{errors.billing_address}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input type="text" name="city" placeholder="City" value={billingForm.city} onChange={handleBillingChange} className={`w-full border px-4 py-2 rounded ${errors.billing_city ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.billing_city && <p className="text-red-500 text-xs">{errors.billing_city}</p>}
                  </div>
                  <div>
                    <input type="text" name="pincode" placeholder="Pincode" value={billingForm.pincode} onChange={handleBillingChange} className={`w-full border px-4 py-2 rounded ${errors.billing_pincode ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.billing_pincode && <p className="text-red-500 text-xs">{errors.billing_pincode}</p>}
                  </div>
                </div>
                <h3 className="text-xl font-semibold pt-4 flex items-center gap-2">
                  Confirm Your Billing Location
                  {isBillingGeocoding && <span className="text-sm text-gray-500">(Fetching address...)</span>}
                </h3>
                <MapSection 
                  key="billing-map" 
                  initialCenter={billingLocation || shippingLocation}
                  onLocationChange={setBillingLocation} 
                  onAddressSelect={handleBillingAddressSelect}
                  onGeocodingStart={() => setIsBillingGeocoding(true)}
                  onGeocodingEnd={() => setIsBillingGeocoding(false)}
                />
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2">Cash on Delivery</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2">Credit/Debit Card</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2">UPI</span>
              </label>
            </div>
          </div>
          
          <div className="pt-4">
             <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Place Order
              </button>
          </div>
        </form>
      </div>

      {/* Right: Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow h-fit">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b py-3">
            <span className="text-gray-600">{item.name} × {item.quantity}</span>
            <span className="font-semibold text-gray-800">
              ₹{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="mt-6 space-y-2">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span> <span>₹{total.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">GSTIN:</span> <span>₹{(total * 0.05).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Shipping:</span> <span>₹80.00</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Discount:</span> <span>- ₹0.00</span></div>
        </div>
        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <span className="text-xl font-bold">Total</span>
          <span className="text-xl font-bold text-blue-600">₹{(total + (total * 0.05) + 80).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

