import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../components/layout/apiService";
import { endpoints } from "../api/endpoints";
import MapSection from "../components/MapSection";
import InputField from "../components/forms/InputField"; // Now using reusable InputField
import { validateEmailPhone } from "../utils/sanatize";

const CheckoutPage = () => {
    const { cartItems, totalAmount, clearCart } = useCart();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const [shippingForm, setShippingForm] = useState({
        name: user ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim() : "",
        phone: user?.phone || "",
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
    });

    const [billingForm, setBillingForm] = useState({
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
    });

    const [shippingLocation, setShippingLocation] = useState({ lat: 17.385, lng: 78.4867 });
    const [billingLocation, setBillingLocation] = useState({ lat: 17.385, lng: 78.4867 });
    const [isShippingGeocoding, setIsShippingGeocoding] = useState(false);
    const [isBillingGeocoding, setIsBillingGeocoding] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [errors, setErrors] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        script.onerror = () => {
            setErrors({ api: t("razorpay sdk not loaded") });
            setRazorpayLoaded(false);
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [t]);

    useEffect(() => {
        if (sameAsShipping) {
            setBillingForm(shippingForm);
            setBillingLocation(shippingLocation);
        }
    }, [shippingForm, sameAsShipping, shippingLocation]);

    const validateForm = () => {
        const newErrors = {};
        if (!shippingForm.name.trim()) newErrors.shipping_name = t("full_name_required");
        const shippingPhoneError = validateEmailPhone(shippingForm.phone, false);
        if (shippingPhoneError) newErrors.shipping_phone = shippingPhoneError;
        if (!shippingForm.street.trim()) newErrors.shipping_address = t("address_required");
        if (!shippingForm.city.trim()) newErrors.shipping_city = t("city_required");
        if (!/^\d{6}$/.test(shippingForm.pincode)) newErrors.shipping_pincode = t("pincode_invalid");

        if (!sameAsShipping) {
            if (!billingForm.name.trim()) newErrors.billing_name = t("full_name_required");
            const billingPhoneError = validateEmailPhone(billingForm.phone, false);
            if (billingPhoneError) newErrors.billing_phone = billingPhoneError;
            if (!billingForm.street.trim()) newErrors.billing_address = t("address_required");
            if (!billingForm.city.trim()) newErrors.billing_city = t("city_required");
            if (!/^\d{6}$/.test(billingForm.pincode)) newErrors.billing_pincode = t("pincode_invalid");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleShippingChange = (e) => setShippingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const handleBillingChange = (e) => setBillingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const handleShippingAddressSelect = (address) => setShippingForm((prev) => ({ ...prev, street: address.address, ...address }));
    const handleBillingAddressSelect = (address) => setBillingForm((prev) => ({ ...prev, street: address.address, ...address }));
    const handleSameAsShippingChange = (e) => setSameAsShipping(e.target.checked);

    const createAddressPayload = (form) => ({
        firstName: form.name.split(" ")[0] || "",
        lastName: form.name.split(" ").slice(1).join(" ") || "",
        addressLine1: form.street,
        city: form.city,
        state: form.state,
        postalCode: form.pincode,
        country: form.country,
        phone: form.phone,
    });
    
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!user || !token) return setErrors({ api: t("Please Login") });
        if (!validateForm()) return;
        if (cartItems.length === 0) return setErrors({ api: t("Your cart is empty ") });
        if (paymentMethod === "razorpay" && !razorpayLoaded) return setErrors({ api: t("Razorpay SDK not loaded") });

        setIsSubmitting(true);

        const authHeaders = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        const orderData = {
            items: cartItems.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
                store_id: item.store_id, 
            })),
            shipping_address: createAddressPayload(shippingForm),
            billing_address: sameAsShipping
                ? createAddressPayload(shippingForm)
                : createAddressPayload(billingForm),
            paymentMethod,
        };
        
        try {
            const createdOrdersResponse = await apiService(endpoints.orders, {
                method: "POST",
               body: orderData,
                headers: authHeaders,
            });

            if (!createdOrdersResponse?.success || !createdOrdersResponse.orders?.length) {
                throw new Error(createdOrdersResponse.message || t("order creation failed"));
            }

            const createdOrders = createdOrdersResponse.orders;
            const orderNumbers = createdOrders.map((order) => order.orderNumber);

            if (paymentMethod === "razorpay") {
                const orderIds = createdOrders.map((order) => order.id);
                
                const razorpayOrderResponse = await apiService(`${endpoints.createRazorpayOrder}/${orderIds[0]}`, {
                    method: "POST",
                    headers: authHeaders,
                });

                if (!razorpayOrderResponse.success) {
                    throw new Error(razorpayOrderResponse.message || t("razorpay order failed"));
                }
                
                const { razorpayOrderId, amount, currency } = razorpayOrderResponse.data;
                const razorpayKeyId = "rzp_test_RIFtktuDIBbnjG";
                if (!razorpayKeyId) {
                    console.error("CRITICAL: Razorpay Key ID not found from backend.");
                    setErrors({ api: "Payment gateway is not configured correctly." });
                    setIsSubmitting(false);
                    return;
                }

                const options = {
                    key: razorpayKeyId,
                    amount,
                    currency,
                    name: "Shopzeo",
                    description: `Payment for order(s): ${orderNumbers.join(', ')}`,
                    order_id: razorpayOrderId,
                    handler: async (response) => {
                        try {
                            const verificationData = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: orderIds[0],
                            };
                            const verificationResponse = await apiService(endpoints.verifyRazorpayPayment, {
                                method: "POST",
                                body: verificationData,
                                headers: authHeaders,
                            });

                            if (verificationResponse.success) {
                                clearCart();
                                navigate("/order-success", { state: { orderNumbers } });
                            } else {
                                setErrors({ api: verificationResponse.message || t("payment verification failed") });
                            }
                        } catch (error) {
                            setErrors({ api: error.message || t("payment verification failed") });
                        }
                    },
                    prefill: { 
                        name: user ? `${user.first_name} ${user.last_name}` : shippingForm.name, 
                        email: user.email, 
                        contact: user.phone || shippingForm.phone 
                    },
                    theme: { color: "#3399cc" },
                    modal: {
                        ondismiss: () => {
                            setErrors({ api: t("payment cancelled") });
                            setIsSubmitting(false);
                        },
                    },
                };
                
                const rzp = new window.Razorpay(options);
                rzp.open();

            } else { 
                clearCart();
                navigate("/order-success", { state: { orderNumbers } });
            }
        } catch (error) {
            console.error("Checkout page error:", error);
            setErrors({ api: error.message || t("unexpected error") });
        } finally {
            if (paymentMethod !== 'razorpay') {
               setIsSubmitting(false);
            }
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <h2 className="text-2xl font-bold mb-4">{t("please_login")}</h2>
                <p className="text-gray-600 mb-6">Please log in to continue with your checkout.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => navigate("/signin", { state: { from: location } })} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">{t("login")}</button>
                    <button onClick={() => navigate("/signup")} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">Sign Up</button>
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
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                    {/* Shipping Form */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{t("shipping_address")}</h2>
                        <div className="space-y-4">
                            <InputField 
                                id="shipping-name" 
                                name="name"
                                placeholder={t("full_name")}
                                value={shippingForm.name} 
                                onChange={handleShippingChange} 
                                error={errors.shipping_name}
                            />
                            <InputField
                                id="shipping-phone"
                                name="phone"
                                placeholder={t("Phone Number")}
                                type="tel"
                                value={shippingForm.phone}
                                onChange={handleShippingChange}
                                error={errors.shipping_phone}
                            />
                            <InputField
                                id="shipping-street"
                                name="street"
                                label="Full Address"
                                placeholder={t("Full Address")}
                                type="textarea"
                                value={shippingForm.street}
                                onChange={handleShippingChange}
                                error={errors.shipping_address}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    id="shipping-city"
                                    name="city"
                                    placeholder={t("city")}
                                    value={shippingForm.city}
                                    onChange={handleShippingChange}
                                    error={errors.shipping_city}
                                />
                                <InputField
                                    id="shipping-pincode"
                                    name="pincode"
                                    placeholder={t("postal_code")}
                                    value={shippingForm.pincode}
                                    onChange={handleShippingChange}
                                    error={errors.shipping_pincode}
                                />
                            </div>
                            <h3 className="text-xl font-semibold pt-4 flex items-center gap-2">
                                {t("confirm shipping location")}
                                {isShippingGeocoding && <span className="text-sm text-gray-500"> (Fetching address...)</span>}
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

                    {/* Billing Form */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{t("billing_address")}</h2>
                        <div className="flex items-center mb-4">
                            <input type="checkbox" id="sameAsShipping" checked={sameAsShipping} onChange={handleSameAsShippingChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                            <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-900">{t("same_as_shipping")}</label>
                        </div>
                        {!sameAsShipping && (
                            <div className="space-y-4">
                                <InputField 
                                    id="billing-name" 
                                    name="name"
                                    placeholder={t("full_name")}
                                    value={billingForm.name} 
                                    onChange={handleBillingChange} 
                                    error={errors.billing_name}
                                />
                                <InputField
                                    id="billing-phone"
                                    name="phone"
                                    placeholder={t("phone_number")}
                                    type="tel"
                                    value={billingForm.phone}
                                    onChange={handleBillingChange}
                                    error={errors.billing_phone}
                                />
                                <InputField
                                    id="billing-street"
                                    name="street"
                                    label="Full Address"
                                    placeholder={t("full_address")}
                                    type="text"
                                    value={billingForm.street}
                                    onChange={handleBillingChange}
                                    error={errors.billing_address}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        id="billing-city"
                                        name="city"
                                        placeholder={t("city")}
                                        value={billingForm.city}
                                        onChange={handleBillingChange}
                                        error={errors.billing_city}
                                    />
                                    <InputField
                                        id="billing-pincode"
                                        name="pincode"
                                        placeholder={t("postal_code")}
                                        value={billingForm.pincode}
                                        onChange={handleBillingChange}
                                        error={errors.billing_pincode}
                                    />
                                </div>
                                <h3 className="text-xl font-semibold pt-4 flex items-center gap-2">
                                    {t("confirm billing location")}
                                    {isBillingGeocoding && <span className="text-sm text-gray-500"> (Fetching address...)</span>}
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
                        <h2 className="text-2xl font-bold mb-4">{t("payment_method")}</h2>
                        <div className="space-y-4">
                            <label className="flex items-center"><input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="h-4 w-4 text-blue-600 border-gray-300"/><span className="ml-2">{t("cod")}</span></label>
                            <label className="flex items-center"><input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} className="h-4 w-4 text-blue-600 border-gray-300"/><span className="ml-2">Razorpay</span></label>
                        </div>
                    </div>
                    {errors.api && <p className="text-red-500 text-sm mt-4">{errors.api}</p>}
                    <button type="submit" disabled={isSubmitting} className={`w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}>
                        {isSubmitting ? "Placing Order..." : t("place_order")}
                    </button>
                </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow h-fit">
                <h2 className="text-2xl font-bold mb-4">{t("order_summary")}</h2>
                {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b py-3">
                        <span className="text-gray-600">{item.name} × {item.quantity}</span>
                        <span className="font-semibold text-gray-800">₹{((item.selling_price || item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                ))}
                <div className="mt-6 space-y-2">
                    <div className="flex justify-between"><span className="text-gray-600">{t("subtotal")}</span><span>₹{(totalAmount || 0).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Tax (18%)</span><span>₹{(totalAmount * 0.18).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">{t("shipping")}</span><span>₹{50.0.toFixed(2)}</span></div>
                </div>
                <div className="flex justify-between items-center mt-6 border-t pt-4">
                    <span className="text-xl font-bold">{t("total")}</span>
                    <span className="text-xl font-bold text-blue-600">₹{(totalAmount + (totalAmount * 0.18) + 50.0).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;