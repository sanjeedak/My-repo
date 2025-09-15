import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../components/layout/apiService";
import { endpoints } from "../api/endpoints";
import MapSection from "../components/MapSection";
import { validateEmailPhone } from "../utils/sanatize";

const CheckoutPage = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [shippingForm, setShippingForm] = useState({
    name: user?.name || "", phone: user?.phone || "", address: "", city: "", state: "", country: "India", pincode: "",
  });

  const [billingForm, setBillingForm] = useState({
    name: "", phone: "", address: "", city: "", state: "", country: "India", pincode: "",
  });

  const [shippingLocation, setShippingLocation] = useState({ lat: 17.385, lng: 78.4867 });
  const [billingLocation, setBillingLocation] = useState({ lat: 17.385, lng: 78.4867 });
  const [isShippingGeocoding, setIsShippingGeocoding] = useState(false);
  const [isBillingGeocoding, setIsBillingGeocoding] = useState(false);

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- START: NEW CHANGES ---
  useEffect(() => {
    // Razorpay के स्क्रिप्ट को लोड करें
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
        // Cleanup the script when the component unmounts
        document.body.removeChild(script);
    }
  }, []);
  // --- END: NEW CHANGES ---

  useEffect(() => {
    if (sameAsShipping) {
      setBillingForm(shippingForm);
      setBillingLocation(shippingLocation);
    }
  }, [shippingForm, sameAsShipping, shippingLocation]);

  const validateForm = () => {
    const newErrors = {};
    if (!shippingForm.name.trim()) newErrors.shipping_name = "Full name is required.";
    const shippingPhoneError = validateEmailPhone(shippingForm.phone, false);
    if (shippingPhoneError) newErrors.shipping_phone = shippingPhoneError;
    if (!shippingForm.address.trim()) newErrors.shipping_address = "Address is required.";
    if (!shippingForm.city.trim()) newErrors.shipping_city = "City is required.";
    if (!/^\d{6}$/.test(shippingForm.pincode)) newErrors.shipping_pincode = "Pincode must be 6 digits.";

    if (!sameAsShipping) {
      if (!billingForm.name.trim()) newErrors.billing_name = "Full name is required.";
      const billingPhoneError = validateEmailPhone(billingForm.phone, false);
      if (billingPhoneError) newErrors.billing_phone = billingPhoneError;
      if (!billingForm.address.trim()) newErrors.billing_address = "Address is required.";
      if (!billingForm.city.trim()) newErrors.billing_city = "City is required.";
      if (!/^\d{6}$/.test(billingForm.pincode)) newErrors.billing_pincode = "Pincode must be 6 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingChange = (e) => setShippingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleBillingChange = (e) => setBillingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleShippingAddressSelect = (address) => setShippingForm((prev) => ({ ...prev, ...address }));
  const handleBillingAddressSelect = (address) => setBillingForm((prev) => ({ ...prev, ...address }));
  const handleSameAsShippingChange = (e) => setSameAsShipping(e.target.checked);
  
  // --- START: MODIFIED FUNCTION ---
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});

    const orderPayload = {
      cartItems: cartItems.map(item => ({
        ...item,
        // Ensure store_id is passed correctly if it's nested
        store_id: item.store?.id 
      })),
      shippingAddress: { ...shippingForm, ...shippingLocation },
      billingAddress: sameAsShipping ? { ...shippingForm, ...shippingLocation } : { ...billingForm, ...billingLocation },
      totalAmount,
      // Pass other details from your existing orderData if needed
      customerId: user.id,
      storeId: cartItems[0]?.store?.id,
    };

    if (paymentMethod === 'cod') {
        try {
            const response = await apiService(endpoints.createCodOrder, 'POST', { ...orderPayload, paymentMethod: 'cod' });
            if (response.success) {
                clearCart();
                navigate("/order-success", { state: { orderId: response.order.orderNumber } });
            } else {
                setErrors({ api: response.message || "Failed to place COD order." });
            }
        } catch (err) {
            setErrors({ api: err.message || "An error occurred with COD." });
        }
    } else if (paymentMethod === 'razorpay') {
        try {
            const { razorpayOrder } = await apiService(endpoints.createRazorpayOrder, 'POST', { totalAmount });
            const { key } = await apiService(endpoints.getRazorpayKey);

            const options = {
                key,
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "Shopzeo",
                description: "Order Payment",
                order_id: razorpayOrder.id,
                handler: async (response) => {
                    const verificationData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        ...orderPayload
                    };
                    const verificationResponse = await apiService(endpoints.verifyRazorpayPayment, 'POST', verificationData);
                    if (verificationResponse.success) {
                        clearCart();
                        navigate(`/order-success`, { state: { orderId: verificationResponse.orderId } });
                    } else {
                        setErrors({ api: 'Payment verification failed. Please contact support.' });
                    }
                },
                prefill: {
                    name: shippingForm.name,
                    email: user?.email,
                    contact: shippingForm.phone
                },
                theme: {
                    color: "#3B82F6"
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setErrors({ api: err.message || 'Failed to initialize Razorpay payment.' });
        }
    }
    
    setIsSubmitting(false);
  };
  // --- END: MODIFIED FUNCTION ---

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to continue</h2>
        <p className="text-gray-600 mb-6">You need to log in before placing an order. Don’t have an account? Register now!</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate("/signin", { state: { from: location } })} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Login</button>
          <button onClick={() => navigate("/signup")} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">Register</button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("cart_empty")}</h2>
        <button onClick={() => navigate("/products")} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{t("continue_shopping")}</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Checkout Form */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          {/* Shipping Address (आपका मौजूदा कोड) */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{t("shipping_address")}</h2>
            <div className="space-y-4">
              <input type="text" name="name" placeholder="Full Name" value={shippingForm.name} onChange={handleShippingChange} className={`w-full border px-4 py-2 rounded ${errors.shipping_name ? "border-red-500" : "border-gray-300"}`} />
              {errors.shipping_name && <p className="text-red-500 text-xs">{errors.shipping_name}</p>}
              <input type="tel" name="phone" placeholder="Phone Number" value={shippingForm.phone} onChange={handleShippingChange} className={`w-full border px-4 py-2 rounded ${errors.shipping_phone ? "border-red-500" : "border-gray-300"}`} />
              {errors.shipping_phone && <p className="text-red-500 text-xs">{errors.shipping_phone}</p>}
              <textarea name="address" placeholder="Full Address" value={shippingForm.address} onChange={handleShippingChange} className={`w-full border px-4 py-2 rounded ${errors.shipping_address ? "border-red-500" : "border-gray-300"}`} />
              {errors.shipping_address && <p className="text-red-500 text-xs">{errors.shipping_address}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input type="text" name="city" placeholder="City" value={shippingForm.city} onChange={handleShippingChange} className={`w-full border px-4 py-2 rounded ${errors.shipping_city ? "border-red-500" : "border-gray-300"}`} />
                  {errors.shipping_city && <p className="text-red-500 text-xs">{errors.shipping_city}</p>}
                </div>
                <div>
                  <input type="text" name="pincode" placeholder="Pincode" value={shippingForm.pincode} onChange={handleShippingChange} className={`w-full border px-4 py-2 rounded ${errors.shipping_pincode ? "border-red-500" : "border-gray-300"}`} />
                  {errors.shipping_pincode && <p className="text-red-500 text-xs">{errors.shipping_pincode}</p>}
                </div>
              </div>
              <h3 className="text-xl font-semibold pt-4 flex items-center gap-2">Confirm Your Shipping Location {isShippingGeocoding && <span className="text-sm text-gray-500">(Fetching address...)</span>}</h3>
              <MapSection key="shipping-map" onLocationChange={setShippingLocation} onAddressSelect={handleShippingAddressSelect} onGeocodingStart={() => setIsShippingGeocoding(true)} onGeocodingEnd={() => setIsShippingGeocoding(false)} />
            </div>
          </div>

          {/* Billing Address (आपका मौजूदा कोड) */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{t("billing_address")}</h2>
            <div className="flex items-center mb-4">
              <input type="checkbox" id="sameAsShipping" checked={sameAsShipping} onChange={handleSameAsShippingChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-900">{t("same_as_shipping")}</label>
            </div>
            {!sameAsShipping && (
              <div className="space-y-4">
                  {/* ... आपका बिलिंग फॉर्म का JSX ... */}
              </div>
            )}
          </div>

          {/* Payment Method - संशोधित */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{t("payment_method")}</h2>
            <div className="space-y-4">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="h-4 w-4 text-blue-600 border-gray-300" />
                <span className="ml-3 font-medium">{t("cod")}</span>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                <input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razoray")} className="h-4 w-4 text-blue-600 border-gray-300" />
                <span className="ml-3 font-medium">Pay with Card / UPI (Razorpay)</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* Right: Order Summary (आपका मौजूदा कोड) */}
      <div className="bg-white p-6 rounded-lg shadow h-fit">
        <h2 className="text-2xl font-bold mb-4">{t("order_summary")}</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b py-3">
            <span className="text-gray-600">{item.name} × {item.quantity}</span>
            <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between"><span className="text-gray-600">{t("subtotal")}</span> <span>₹{(totalAmount || 0).toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">{t("shipping")}</span> <span>Free</span></div>
        </div>
        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <span className="text-xl font-bold">{t("total")}</span>
          <span className="text-xl font-bold text-blue-600">₹{(totalAmount || 0).toFixed(2)}</span>
        </div>
        {errors.api && <p className="text-red-500 text-sm mt-4">{errors.api}</p>}
        <button onClick={handlePlaceOrder} disabled={isSubmitting} className={`w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}>
          {isSubmitting ? "Placing Order..." : t("place_order")}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;