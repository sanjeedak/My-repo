import { useState, useEffect } from "react";

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If script already exists
    if (document.getElementById("razorpay-script")) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.id = "razorpay-script";
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      setError(null);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      setError("Failed to load Razorpay SDK");
      setIsLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return { isLoaded, error };
};