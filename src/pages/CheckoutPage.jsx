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
  const { user } = useAuth();
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

  // Removed the unused `shippingLocation` state
  // const [shippingLocation, setShippingLocation] = useState({
  //   lat: 17.385,
  //   lng: 78.4867,
  // });

  const [isShippingGeocoding, setIsShippingGeocoding] = useState(false);
  const [isBillingGeocoding, setIsBillingGeocoding] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Razorpay script loader (safe, reusable)
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector("#razorpay-script")) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (sameAsShipping) {
      setBillingForm(shippingForm);
    }
  }, [shippingForm, sameAsShipping]);

  const validateForm = () => {
    const newErrors = {};
    if (!shippingForm.name.trim())
      newErrors.shipping_name = t("full_name_required");
    const shippingPhoneError = validateEmailPhone(shippingForm.phone, false);
    if (shippingPhoneError) newErrors.shipping_phone = shippingPhoneError;
    if (!shippingForm.street.trim())
      newErrors.shipping_address = t("address_required");
    if (!shippingForm.city.trim())
      newErrors.shipping_city = t("city_required");
    if (!/^\d{6}$/.test(shippingForm.pincode))
      newErrors.shipping_pincode = t("pincode_invalid");

    if (!sameAsShipping) {
      if (!billingForm.name.trim())
        newErrors.billing_name = t("full_name_required");
      const billingPhoneError = validateEmailPhone(billingForm.phone, false);
      if (billingPhoneError) newErrors.billing_phone = billingPhoneError;
      if (!billingForm.street.trim())
        newErrors.billing_address = t("address_required");
      if (!billingForm.city.trim())
        newErrors.billing_city = t("city_required");
      if (!/^\d{6}$/.test(billingForm.pincode))
        newErrors.billing_pincode = t("pincode_invalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingChange = (e) =>
    setShippingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleBillingChange = (e) =>
    setBillingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleShippingAddressSelect = (address) =>
    setShippingForm((prev) => ({ ...prev, street: address.address, ...address }));
  const handleBillingAddressSelect = (address) =>
    setBillingForm((prev) => ({ ...prev, street: address.address, ...address }));
  const handleSameAsShippingChange = (e) =>
    setSameAsShipping(e.target.checked);

  const createAddressPayload = (form) => ({
    firstName: form.name.split(" ")[0] || "",
    lastName: form.name.split(" ").slice(1).join(" ") || "",
    addressLine1: form.street,
    city: form.city,
    postalCode: form.pincode,
    country: form.country,
    phone: form.phone,
  });

  // ✅ Place Order Handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!user) return setErrors({ api: t("please_login") });
    if (!validateForm()) return;
    if (cartItems.length === 0)
      return setErrors({ api: t("cart_empty") });

    setIsSubmitting(true);

    const orderData = {
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        store_id: item.store?.id,
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
      });

      if (
        !createdOrdersResponse?.success ||
        !createdOrdersResponse.orders?.length
      ) {
        throw new Error(
          createdOrdersResponse.message || t("order_creation_failed")
        );
      }

      const createdOrders = createdOrdersResponse.orders;
      const orderNumbers = createdOrders.map((order) => order.orderNumber);

      // 🔹 If Razorpay is selected
      if (paymentMethod === "razorpay") {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded || !window.Razorpay) {
          setErrors({ api: t("razorpay_sdk_not_loaded") });
          setIsSubmitting(false);
          return;
        }

        const primaryOrderId = createdOrders[0].id;
        const razorpayEndpoint = `${endpoints.createRazorpayOrder}/${primaryOrderId}`;

        const razorpayOrderResponse = await apiService(razorpayEndpoint, {
          method: "POST",
          body: {}, // send empty body so API doesn’t reject
        });

        if (!razorpayOrderResponse.success || !razorpayOrderResponse.data) {
          throw new Error(
            razorpayOrderResponse.message || t("razorpay_order_failed")
          );
        }

        const { razorpayOrderId, amount, currency } =
          razorpayOrderResponse.data;
        const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID;

        if (!razorpayKeyId) {
          console.error("⚠️ Razorpay Key missing in .env");
          setErrors({ api: "Payment gateway not configured" });
          setIsSubmitting(false);
          return;
        }

        const options = {
          key: razorpayKeyId,
          amount, // should be in paise (from backend)
          currency,
          name: "Shopzeo",
          description: `Payment for order(s): ${orderNumbers.join(", ")}`,
          order_id: razorpayOrderId,
          handler: async (response) => {
            try {
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: primaryOrderId,
              };

              const verificationResponse = await apiService(
                endpoints.verifyRazorpayPayment,
                {
                  method: "POST",
                  body: verificationData,
                }
              );

              if (verificationResponse.success) {
                clearCart();
                navigate("/order-success", {
                  state: {
                    orderNumbers,
                    transactionId: response.razorpay_payment_id,
                  },
                });
              } else {
                setErrors({
                  api:
                    verificationResponse.message ||
                    t("payment_verification_failed"),
                });
              }
            } catch (error) {
              setErrors({
                api: error.message || t("payment_verification_failed"),
              });
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone,
          },
          theme: { color: "#3399cc" },
          modal: {
            ondismiss: () => {
              setErrors({ api: t("payment_cancelled") });
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // 🔹 COD flow
        clearCart();
        navigate("/order-success", { state: { orderNumbers } });
      }
    } catch (error) {
      console.error("Checkout page error:", error);
      setErrors({ api: error.message || t("unexpected_error") });
      setIsSubmitting(false);
    }
  };

  // 🔹 UI rendering
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
          {/* Shipping Form */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {t("shipping_address")}
            </h2>
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
                <p className="text-red-500 text-xs">
                  {errors.shipping_name}
                </p>
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
                <p className="text-red-500 text-xs">
                  {errors.shipping_phone}
                </p>
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
                <p className="text-red-500 text-xs">
                  {errors.shipping_address}
                </p>
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
                      errors.shipping_city
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.shipping_city && (
                    <p className="text-red-500 text-xs">
                      {errors.shipping_city}
                    </p>
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
                      errors.shipping_pincode
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.shipping_pincode && (
                    <p className="text-red-500 text-xs">
                      {errors.shipping_pincode}
                    </p>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-semibold pt-4 flex items-center gap-2">
                {t("confirm_shipping_location")}{" "}
                {isShippingGeocoding && (
                  <span className="text-sm text-gray-500">
                    {t("fetching_address")}
                  </span>
                )}
              </h3>
              <MapSection
                key="shipping-map"
                onLocationChange={() => {}} // An empty function as the value is not used
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
              <input
                type="checkbox"
                id="sameAsShipping"
                checked={sameAsShipping}
                onChange={handleSameAsShippingChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="sameAsShipping"
                className="ml-2 block text-sm text-gray-900"
              >
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
                  <p className="text-red-500 text-xs">
                    {errors.billing_name}
                  </p>
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
                  <p className="text-red-500 text-xs">
                    {errors.billing_phone}
                  </p>
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
                  <p className="text-red-500 text-xs">
                    {errors.billing_address}
                  </p>
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
                        errors.billing_city
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.billing_city && (
                      <p className="text-red-500 text-xs">
                        {errors.billing_city}
                      </p>
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
                        errors.billing_pincode
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.billing_pincode && (
                      <p className="text-red-500 text-xs">
                        {errors.billing_pincode}
                      </p>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-semibold pt-4 flex items-center gap-2">
                  {t("confirm_billing_location")}{" "}
                  {isBillingGeocoding && (
                    <span className="text-sm text-gray-500">
                      {t("fetching_address")}
                    </span>
                  )}
                </h3>
                <MapSection
                  key="billing-map"
                  onLocationChange={() => {}} // An empty function
                  onAddressSelect={handleBillingAddressSelect}
                  onGeocodingStart={() => setIsBillingGeocoding(true)}
                  onGeocodingEnd={() => setIsBillingGeocoding(false)}
                />
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{t("payment_method")}</h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mr-2"
                />
                {t("cash_on_delivery")}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="mr-2"
                />
                {t("razorpay")}
              </label>
            </div>
          </div>

          {/* Submit */}
          {errors.api && (
            <p className="text-red-500 text-sm">{errors.api}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? t("processing") : t("place_order")}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">{t("order_summary")}</h2>
        <ul className="divide-y">
          {cartItems.map((item) => (
            <li key={item.id} className="py-4 flex justify-between">
              <span>{item.name}</span>
              <span>
                {item.quantity} × ₹{item.price}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>{t("total")}</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;