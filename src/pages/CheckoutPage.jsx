import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../components/layout/apiService";
import { endpoints } from "../api/endpoints";
import MapSection from "../components/MapSection";
import { Input } from "../components/forms/InputField"; 
import AddressAutocomplete from "../components/AddressAutocomplete";
import { validateEmailPhone } from "../utils/sanatize";
import { useMap } from "../context/MapProvider";
import { useRazorpay } from "../hooks/useRazorPay";

const CheckoutPage = () => {
    const { cartItems, totalAmount, clearCart } = useCart();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    useMap();

    const { isLoaded: razorpayLoaded, error: razorpayError } = useRazorpay();

    const DEFAULT_LOCATION = { lat: 17.385, lng: 78.4867 };

    const [shippingForm, setShippingForm] = useState({
        name: user ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim() : "",
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

    const [shippingLocation, setShippingLocation] = useState(DEFAULT_LOCATION);
    const [billingLocation, setBillingLocation] = useState(DEFAULT_LOCATION);
    const [isShippingGeocoding, setIsShippingGeocoding] = useState(false);
    const [isBillingGeocoding, setIsBillingGeocoding] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [errors, setErrors] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newLocation = { lat: latitude, lng: longitude };
                    setShippingLocation(newLocation);
                    if (sameAsShipping) setBillingLocation(newLocation);
                },
                () => console.warn("Geolocation failed. Using default location.")
            );
        }
    }, [sameAsShipping]);

    useEffect(() => {
        if (sameAsShipping) {
            setBillingForm({ ...shippingForm });
            setBillingLocation({ ...shippingLocation });
        }
    }, [shippingForm, shippingLocation, sameAsShipping]);

    useEffect(() => {
        if (razorpayError) {
            setErrors((prev) => ({ ...prev, api: t("Failed to load Razorpay SDK. Please try again later.") }));
        }
    }, [razorpayError, t]);

    const validateForm = () => {
        const newErrors = {};
        if (!shippingForm.name.trim()) newErrors.shipping_name = t("Fullname is required");
        const shippingPhoneError = validateEmailPhone(shippingForm.phone, false);
        if (shippingPhoneError) newErrors.shipping_phone = shippingPhoneError;
        if (!shippingForm.street.trim()) newErrors.shipping_address = t("Address is required");
        if (!shippingForm.city.trim()) newErrors.shipping_city = t("City is required");
        if (!/^\d{6}$/.test(shippingForm.pincode)) newErrors.shipping_pincode = t("Invalid pincode");

        if (!sameAsShipping) {
            if (!billingForm.name.trim()) newErrors.billing_name = t("Full name is required");
            const billingPhoneError = validateEmailPhone(billingForm.phone, false);
            if (billingPhoneError) newErrors.billing_phone = billingPhoneError;
            if (!billingForm.street.trim()) newErrors.billing_address = t("Address required");
            if (!billingForm.city.trim()) newErrors.billing_city = t("City is required");
            if (!/^\d{6}$/.test(billingForm.pincode)) newErrors.billing_pincode = t("Invalid pincode");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceSelect = (place, formType) => {
        if (!place.geometry) return;

        const location = place.geometry.location;
        const newCoords = { lat: location.lat(), lng: location.lng() };
        const addressComponents = place.address_components;
        const getComponent = (type) => addressComponents.find((c) => c.types.includes(type))?.long_name || "";

        const updatedForm = {
            street: place.formatted_address,
            city: getComponent("locality") || getComponent("administrative_area_level_2") || "",
            state: getComponent("administrative_area_level_1") || "",
            pincode: getComponent("postal_code") || "",
            country: getComponent("country") || "India",
        };

        if (formType === "shipping") {
            setShippingForm((prev) => ({ ...prev, ...updatedForm }));
            setShippingLocation(newCoords);
        } else {
            setBillingForm((prev) => ({ ...prev, ...updatedForm }));
            setBillingLocation(newCoords);
        }
    };

    const handleShippingChange = (e) => setShippingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const handleBillingChange = (e) => setBillingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSameAsShippingChange = (e) => {
        setSameAsShipping(e.target.checked);
        if (e.target.checked) {
            setBillingForm({ ...shippingForm });
            setBillingLocation({ ...shippingLocation });
        }
    };

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

        if (!user || !token) {
            setErrors({ api: t("Please login to continue") });
            navigate("/signin", { state: { from: location } });
            return;
        }

        if (!validateForm()) return;
        if (cartItems.length === 0) return setErrors({ api: t("Your cart is empty") });
        if (paymentMethod === "razorpay" && !razorpayLoaded) {
            return setErrors({ api: t("Razorpay SDK not loaded. Please try again later.") });
        }

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
                throw new Error(createdOrdersResponse.message || t("Order creation failed"));
            }

            const createdOrders = createdOrdersResponse.orders;
            const primaryOrderId = createdOrders[0].id;

            if (paymentMethod === "razorpay") {
                const amount = Math.round((totalAmount + totalAmount * 0.18 + 50) * 100); // Amount in paisa
                const razorpayOrderResponse = await apiService(`${endpoints.createRazorpayOrder}/${primaryOrderId}`, {
                    method: "POST",
                    headers: authHeaders,
                    body: {
                        amount,
                        currency: "INR",
                    },
                });

                if (!razorpayOrderResponse.success) {
                    throw new Error(razorpayOrderResponse.message || t("Razorpay order creation failed"));
                }

                const { razorpayOrderId, amount: razorpayAmount, currency } = razorpayOrderResponse.data;
                const razorpayKeyId = import.meta.env.VITE_APP_RAZORPAY_KEY_ID;

                if (!razorpayKeyId) {
                    setErrors((prev) => ({ ...prev, api: t("Razorpay configuration missing. Please contact support.") }));
                    setIsSubmitting(false);
                    return;
                }

                const options = {
                    key: razorpayKeyId,
                    amount: razorpayAmount,
                    currency,
                    name: "Shopzeo",
                    description: `Order #${createdOrders[0].orderNumber}`,
                    order_id: razorpayOrderId,
                    handler: async (response) => {
                        try {
                            const verifyResponse = await apiService(`${endpoints.verifyRazorpayPayment}/${primaryOrderId}`, {
                                method: "POST",
                                body: {
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature,
                                },
                                headers: authHeaders,
                            });

                            if (verifyResponse.success) {
                                clearCart();
                                navigate(`/track-order/${createdOrders[0].orderNumber}`, { state: { order: createdOrders[0] } });
                            } else {
                                throw new Error(verifyResponse.message || t("Payment verification failed"));
                            }
                        } catch (err) {
                            setErrors((prev) => ({ ...prev, api: `Payment verification failed: ${err.message}` }));
                        } finally {
                            setIsSubmitting(false);
                        }
                    },
                    prefill: {
                        name: shippingForm.name,
                        email: user.email,
                        contact: shippingForm.phone,
                    },
                    theme: { color: "#3399cc" },
                    notes: {
                        order_id: primaryOrderId,
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.on("payment.failed", (response) => {
                    setErrors((prev) => ({
                        ...prev,
                        api: `Payment failed: ${response.error.description || "Unknown error"}`,
                    }));
                    setIsSubmitting(false);
                });
                rzp.open();
            } else {
                clearCart();
                navigate(`/order-success/${createdOrders[0].orderNumber}`, { state: { order: createdOrders[0] } });
            }
        } catch (err) {
            console.error("Order creation error:", err);
            setErrors((prev) => ({ ...prev, api: `Order creation failed: ${err.message}` }));
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Checkout Form */}
                <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">{t("Shipping address")}</h2>
                    <div className="space-y-5">
                        <Input
                            id="shipping-name"
                            name="name"
                            placeholder={t("Full name")}
                            value={shippingForm.name}
                            onChange={handleShippingChange}
                            error={errors.shipping_name}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Input
                            id="shipping-phone"
                            name="phone"
                            label={t("Phone Number")}
                            placeholder={t("Phone number")}
                            type="tel"
                            value={shippingForm.phone}
                            onChange={handleShippingChange}
                            error={errors.shipping_phone}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <AddressAutocomplete
                            label={t("Full Address")}
                            value={shippingForm.street}
                            onChange={handleShippingChange}
                            onPlaceSelect={(place) => handlePlaceSelect(place, "shipping")}
                            error={errors.shipping_address}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                            <Input
                                id="shipping-city"
                                name="city"
                                label={t("City")}
                                placeholder={t("city")}
                                value={shippingForm.city}
                                onChange={handleShippingChange}
                                error={errors.shipping_city}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Input
                                id="shipping-pincode"
                                name="pincode"
                                label={t("Postal code")}
                                placeholder={t("Postal code")}
                                value={shippingForm.pincode}
                                onChange={handleShippingChange}
                                error={errors.shipping_pincode}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 pt-3 flex items-center gap-2">
                            {t("Confirm Shipping Location")} {isShippingGeocoding && <span className="text-sm text-gray-500">({t("fetching_address")}...)</span>}
                        </h3>
                        <div className="h-64 w-full rounded-md overflow-hidden">
                            <MapSection
                                key={`shipping-${shippingLocation.lat}-${shippingLocation.lng}`}
                                initialCenter={shippingLocation}
                                onLocationChange={setShippingLocation}
                                onAddressSelect={(address) => setShippingForm((prev) => ({ ...prev, street: address.address }))}
                                onGeocodingStart={() => setIsShippingGeocoding(true)}
                                onGeocodingEnd={() => setIsShippingGeocoding(false)}
                                className="w-full h-full"
                            />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">{t("Billing address")}</h2>
                        <div className="flex items-center mt-4 mb-3">
                            <input
                                type="checkbox"
                                id="sameAsShipping"
                                checked={sameAsShipping}
                                onChange={handleSameAsShippingChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
                                {t("Same as shipping")}
                            </label>
                        </div>
                        {!sameAsShipping && (
                            <div className="space-y-5">
                                <Input
                                    id="billing-name"
                                    name="name"
                                    placeholder={t("Full name")}
                                    value={billingForm.name}
                                    onChange={handleBillingChange}
                                    error={errors.billing_name}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Input
                                    id="billing-phone"
                                    name="phone"
                                    placeholder={t("Phone number")}
                                    type="tel"
                                    value={billingForm.phone}
                                    onChange={handleBillingChange}
                                    error={errors.billing_phone}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <AddressAutocomplete
                                    label={t("Full Address")}
                                    value={billingForm.street}
                                    onChange={handleBillingChange}
                                    onPlaceSelect={(place) => handlePlaceSelect(place, "billing")}
                                    error={errors.billing_address}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                                    <Input
                                        id="billing-city"
                                        name="city"
                                        label={t("City")}
                                        placeholder={t("city")}
                                        value={billingForm.city}
                                        onChange={handleBillingChange}
                                        error={errors.billing_city}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Input
                                        id="billing-pincode"
                                        name="pincode"
                                        label={t("Postal code")}
                                        placeholder={t("Postal code")}
                                        value={billingForm.pincode}
                                        onChange={handleBillingChange}
                                        error={errors.billing_pincode}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 pt-3 flex items-center gap-2">
                                    {t("Confirm Billing Location")} {isBillingGeocoding && <span className="text-sm text-gray-500">({t("fetching_address")}...)</span>}
                                </h3>
                                <div className="h-64 w-full rounded-md overflow-hidden">
                                    <MapSection
                                        key={`billing-${billingLocation.lat}-${billingLocation.lng}`}
                                        initialCenter={billingLocation}
                                        onLocationChange={setBillingLocation}
                                        onAddressSelect={(address) => setBillingForm((prev) => ({ ...prev, street: address.address }))}
                                        onGeocodingStart={() => setIsBillingGeocoding(true)}
                                        onGeocodingEnd={() => setIsBillingGeocoding(false)}
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">{t("Payment Method")}</h2>
                        <div className="space-y-4 mt-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === "cod"}
                                    onChange={() => setPaymentMethod("cod")}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-700">{t("cod")}</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="razorpay"
                                    checked={paymentMethod === "razorpay"}
                                    onChange={() => setPaymentMethod("razorpay")}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-700">Razorpay</span>
                            </label>
                            {!razorpayLoaded && paymentMethod === "razorpay" && (
                                <p className="text-yellow-600 text-sm mt-1 flex items-center gap-2">
                                    <span className="animate-pulse">⏳</span> {t("Razorpay SDK is loading...")}
                                </p>
                            )}
                            {razorpayError && paymentMethod === "razorpay" && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-2">
                                    <span>⚠️</span> {t("Razorpay SDK failed to load. Please try again or use COD.")}
                                </p>
                            )}
                        </div>
                    </div>

                    {errors.api && (
                        <p className="text-red-500 text-sm mt-4 bg-red-50 p-2 rounded-md">{errors.api}</p>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting || (paymentMethod === "razorpay" && !razorpayLoaded)}
                        onClick={handlePlaceOrder}
                        className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${isSubmitting || (paymentMethod === "razorpay" && !razorpayLoaded)
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-md"
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                {t("Placing Order...")}
                            </span>
                        ) : (
                            t("Place order")
                        )}
                    </button>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">{t("order_summary")}</h2>
                    <div className="space-y-4 mt-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-700">{item.name} × {item.quantity}</span>
                                <span className="font-medium text-gray-900">
                                    ₹{((item.selling_price || item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </span>
                            </div>
                        ))}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t("subtotal")}</span>
                                <span className="text-gray-900">₹{(totalAmount || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax (18%)</span>
                                <span className="text-gray-900">₹{(totalAmount * 0.18).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t("shipping")}</span>
                                <span className="text-gray-900">₹{50.0.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-6 border-t pt-4">
                            <span className="text-xl font-bold text-gray-800">{t("Total")}</span>
                            <span className="text-xl font-bold text-blue-600">
                                ₹{(totalAmount + totalAmount * 0.18 + 50.0).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;