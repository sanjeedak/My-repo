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
    name: user?.name || "",
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

  const [shippingLocation, setShippingLocation] = useState({
    lat: 17.385,
    lng: 78.4867,
  });
  const [billingLocation, setBillingLocation] = useState({
    lat: 17.385,
    lng: 78.4867,
  });
  const [isShippingGeocoding, setIsShippingGeocoding] = useState(false);
  const [isBillingGeocoding, setIsBillingGeocoding] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay SDK with error handling
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      setErrors({ api: t("razorpay_sdk_not_loaded") });
      setRazorpayLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
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

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingAddressSelect = (address) => {
    setShippingForm((prev) => ({ ...prev, street: address.address, ...address }));
  };

  const handleBillingAddressSelect = (address) => {
    setBillingForm((prev) => ({ ...prev, street: address.address, ...address }));
  };

  const handleSameAsShippingChange = (e) => {
    setSameAsShipping(e.target.checked);
  };

  const createAddressPayload = (form) => {
    const nameParts = form.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");
    return {
      firstName,
      lastName,
      addressLine1: form.street, // Changed from 'street' to 'addressLine1' to match backend
      city: form.city,
      postalCode: form.pincode,
      country: form.country,
      phone: form.phone,
    };
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!user) {
      setErrors({ api: t("please_login") });
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      setErrors({ api: t("cart_empty") });
      setIsSubmitting(false);
      return;
    }

    if (paymentMethod === "razorpay" && !razorpayLoaded) {
      setErrors({ api: t("razorpay_sdk_not_loaded") });
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        store_id: item.store.id,
      })),
      shipping_address: createAddressPayload(shippingForm),
      billing_address: sameAsShipping
        ? createAddressPayload(shippingForm)
        : createAddressPayload(billingForm),
      paymentMethod,
      notes: "",
      discount_amount: 0,
    };

    try {
      console.log("Creating order with data:", orderData);
      const createdOrdersResponse = await apiService(endpoints.orders, {
        method: "POST",
        body: orderData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!createdOrdersResponse?.success || !createdOrdersResponse.orders?.length) {
        throw new Error(createdOrdersResponse.message || t("order_creation_failed"));
      }

      if (paymentMethod === "razorpay") {
        if (!window.Razorpay) {
          throw new Error(t("razorpay_sdk_not_loaded"));
        }

        const orderNumbers = [];
        for (const order of createdOrdersResponse.orders) {
          const razorpayOrderResponse = await apiService(`${endpoints.payments}/${order.id}/razorpay`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!razorpayOrderResponse.success) {
            throw new Error(razorpayOrderResponse.message || t("razorpay_order_failed"));
          }

          const { razorpayOrderId, amount, currency } = razorpayOrderResponse.data;

          const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount,
            currency,
            name: "Shopzeo",
            description: `Order #${order.orderNumber}`,
            order_id: razorpayOrderId,
            handler: async (response) => {
              try {
                const verificationData = {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: order.id,
                };

                const verificationResponse = await apiService(endpoints.verifyRazorpayPayment, {
                  method: "POST",
                  body: verificationData,
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (verificationResponse.success) {
                  orderNumbers.push(order.orderNumber);
                } else {
                  setErrors({ api: verificationResponse.message || t("payment_verification_failed") });
                }
              } catch (error) {
                setErrors({ api: error.message || t("payment_verification_failed") });
              }
            },
            prefill: {
              name: user.name,
              email: user.email,
              contact: user.phone,
            },
            theme: {
              color: "#3399cc",
            },
            method: {
              netbanking: true,
              card: true,
              upi: true,
              wallet: true,
            },
            modal: {
              ondismiss: () => {
                setErrors({ api: t("payment_cancelled") });
                setIsSubmitting(false);
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on("payment.failed", (response) => {
            setErrors({ api: response.error.description || t("payment_failed") });
            setIsSubmitting(false);
          });
          rzp.open();

          await new Promise((resolve) => {
            rzp.on("payment.success", resolve);
            rzp.on("payment.failed", resolve);
            rzp.on("modal.dismiss", resolve);
          });
        }

        if (orderNumbers.length > 0) {
          navigate("/order-success", { state: { orderNumbers } });
          clearCart();
        }
      } else {
        const orderNumbers = createdOrdersResponse.orders.map((order) => order.orderNumber);
        navigate("/order-success", { state: { orderNumbers } });
        clearCart();
      }
    } catch (error) {
      console.error("Order failed:", error);
      setErrors({ api: error.message || t("unexpected_error") });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("please_login")}</h2>
        <p className="text-gray-600 mb-6">{t("login_prompt")}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/signin", { state: { from: location } })}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {t("login")}
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            {t("register")}
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("cart_empty")}</h2>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {t("continue_shopping")}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">{t("shipping_address")}</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder={t("full_name")}
                value={shippingForm.name}
                onChange={handleShippingChange}
                className={`w-full border px-4 py-2 rounded ${
                  errors.shipping_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.shipping_name && (
                <p className="text-red-500 text-xs">{errors.shipping_name}</p>
              )}
              <input
                type="tel"
                name="phone"
                placeholder={t("phone_number")}
                value={shippingForm.phone}
                onChange={handleShippingChange}
                className={`w-full border px-4 py-2 rounded ${
                  errors.shipping_phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.shipping_phone && (
                <p className="text-red-500 text-xs">{errors.shipping_phone}</p>
              )}
              <textarea
                name="street"
                placeholder={t("full_address")}
                value={shippingForm.street}
                onChange={handleShippingChange}
                className={`w-full border px-4 py-2 rounded ${
                  errors.shipping_address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.shipping_address && (
                <p className="text-red-500 text-xs">{errors.shipping_address}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="city"
                    placeholder={t("city")}
                    value={shippingForm.city}
                    onChange={handleShippingChange}
                    className={`w-full border px-4 py-2 rounded ${
                      errors.shipping_city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.shipping_city && (
                    <p className="text-red-500 text-xs">{errors.shipping_city}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="pincode"
                    placeholder={t("pincode")}
                    value={shippingForm.pincode}
                    onChange={handleShippingChange}
                    className={`w-full border px-4 py-2 rounded ${
                      errors.shipping_pincode ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.shipping_pincode && (
                    <p className="text-red-500 text-xs">{errors.shipping_pincode}</p>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-semibold pt-4 flex items-center gap-2">
                {t("confirm_shipping_location")}
                {isShippingGeocoding && (
                  <span className="text-sm text-gray-500">{t("fetching_address")}</span>
                )}
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

          <div>
            <h2 className="text-2xl font-bold mb-4">{t("billing_address")}</h2>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="sameAsShipping"
                checked={sameAsShipping}
                onChange={handleSameAsShippingChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-900">
                {t("same_as_shipping")}
              </label>
            </div>
            {!sameAsShipping && (
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder={t("full_name")}
                  value={billingForm.name}
                  onChange={handleBillingChange}
                  className={`w-full border px-4 py-2 rounded ${
                    errors.billing_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.billing_name && (
                  <p className="text-red-500 text-xs">{errors.billing_name}</p>
                )}
                <input
                  type="tel"
                  name="phone"
                  placeholder={t("phone_number")}
                  value={billingForm.phone}
                  onChange={handleBillingChange}
                  className={`w-full border px-4 py-2 rounded ${
                    errors.billing_phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.billing_phone && (
                  <p className="text-red-500 text-xs">{errors.billing_phone}</p>
                )}
                <textarea
                  name="street"
                  placeholder={t("full_address")}
                  value={billingForm.street}
                  onChange={handleBillingChange}
                  className={`w-full border px-4 py-2 rounded ${
                    errors.billing_address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.billing_address && (
                  <p className="text-red-500 text-xs">{errors.billing_address}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="city"
                      placeholder={t("city")}
                      value={billingForm.city}
                      onChange={handleBillingChange}
                      className={`w-full border px-4 py-2 rounded ${
                        errors.billing_city ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.billing_city && (
                      <p className="text-red-500 text-xs">{errors.billing_city}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="pincode"
                      placeholder={t("pincode")}
                      value={billingForm.pincode}
                      onChange={handleBillingChange}
                      className={`w-full border px-4 py-2 rounded ${
                        errors.billing_pincode ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.billing_pincode && (
                      <p className="text-red-500 text-xs">{errors.billing_pincode}</p>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-semibold pt-4 flex items-center gap-2">
                  {t("confirm_billing_location")}
                  {isBillingGeocoding && (
                    <span className="text-sm text-gray-500">{t("fetching_address")}</span>
                  )}
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

          <div>
            <h2 className="text-2xl font-bold mb-4">{t("payment_method")}</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2">{t("cod")}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2">{t("razorpay")}</span>
              </label>
            </div>
          </div>

          {errors.api && (
            <p className="text-red-500 text-sm mt-4">{errors.api}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? t("placing_order") : t("place_order")}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow h-fit">
        <h2 className="text-2xl font-bold mb-4">{t("order_summary")}</h2>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-3"
          >
            <span className="text-gray-600">
              {item.name} × {item.quantity}
            </span>
            <span className="font-semibold text-gray-800">
              ₹{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">{t("subtotal")}</span>
            <span>₹{(totalAmount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t("tax")}</span>
            <span>₹{(totalAmount * 0.18).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t("shipping")}</span>
            <span>₹{50.0.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <span className="text-xl font-bold">{t("total")}</span>
          <span className="text-xl font-bold text-blue-600">
            ₹{(totalAmount + totalAmount * 0.18 + 50.0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;