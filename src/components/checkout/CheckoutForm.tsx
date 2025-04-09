import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { checkoutFormStateAndValidation } from "./CheckoutFormStateAndValidation.ts";
import { useCart } from "react-use-cart";

interface CheckoutFormProps {
  clientSecret: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret }) => {
  // Only initialize Stripe hooks if we have a clientSecret (paid items)
  const stripe = clientSecret ? useStripe() : null;
  const elements = clientSecret ? useElements() : null;

  const { items } = useCart();

  const isBasketFree = (items: any[]): boolean => {
    return items.every((item) => item.price === 0);
  };

  const {
    firstName,
    setFirstName,
    surname,
    setSurname,
    email,
    setEmail,
    agreedToTerms,
    setAgreedToTerms,
    receiveUpdates,
    setReceiveUpdates,
    showUpdatesCheckbox,
    setShowUpdatesCheckbox,
    errors,
    setErrors,
    validateForm,
    validateEmail,
  } = checkoutFormStateAndValidation();

  // State variables
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [kitSubscriberId, setKitSubscriberId] = useState<string | null>(null);
  const [isCheckingKit, setIsCheckingKit] = useState(false);

  useEffect(() => {
    // Extract paymentIntentId from the clientSecret
    if (clientSecret) {
      const extractedPaymentIntentId = clientSecret.split("_secret")[0];
      setPaymentIntentId(extractedPaymentIntentId);
    }
  }, [clientSecret]);

  // Handle First Name Change
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);

    // Clear the error message as soon as the user types
    if (e.target.value.trim() !== "") {
      setErrors((prev) => ({ ...prev, firstName: "" }));
    }
  };

  // Handle Surname Change
  const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurname(e.target.value);

    // Clear the error message as soon as the user types
    if (e.target.value.trim() !== "") {
      setErrors((prev) => ({ ...prev, surname: "" }));
    }
  };

  // Handle Terms Checkbox Interaction
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setAgreedToTerms(isChecked);

    // Clear the error for terms as soon as it's checked
    if (isChecked) {
      setErrors((prev) => ({ ...prev, terms: "" }));
    }
  };

  // Handle changes to the email field
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target.value;
    setEmail(emailInput);

    // Clear subscriber ID immediately if the email is changed/removed
    setKitSubscriberId(null);

    // Validate email and update errors
    if (!validateEmail(emailInput)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
      setShowUpdatesCheckbox(false);
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  // Handle when the user finishes editing the email field
  const handleEmailBlur = async () => {
    // Check if the email is valid before making the request
    if (validateEmail(email)) {
      setIsCheckingKit(true); // Indicate the ConvertKit check is in progress

      try {
        const res = await fetch(
          `/api/get-kit-user?email=${encodeURIComponent(email)}`,
        );
        const data = await res.json();

        if (res.ok && data.subscriber) {
          setKitSubscriberId(data.subscriber.id); // Set the subscriber ID
          setShowUpdatesCheckbox(false); // Hide checkbox if user exists
        } else {
          setKitSubscriberId(null);
          setShowUpdatesCheckbox(true); // Show checkbox if user doesn't exist
        }
      } catch (error) {
        console.error("Error validating email:", error);
        setMessage("An error occurred while validating the email.");
      } finally {
        setIsCheckingKit(false); // API call complete
      }
    } else {
      // Reset any existing subscriber ID since the email is invalid
      setKitSubscriberId(null);
      setShowUpdatesCheckbox(false); // Hide updates checkbox for invalid email
    }
  };

  const origin = window.location.origin;

  // Fetch user data from cookies and prefill inputs on mount
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetch("/api/get-user-cookie", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //
  //       if (response.ok) {
  //         const data = await response.json();
  //         const { firstName, surname, email } = data;
  //         setFirstName(firstName || ""); // Fill fields if data exists
  //         setSurname(surname || "");
  //         setEmail(email || "");
  //       } else {
  //         // Optionally handle cases where no user data exists
  //         console.log("checkout form: No user data found in cookies.");
  //       }
  //     } catch (error) {
  //       console.error("checout form: Error fetching user data:", error);
  //     }
  //   };
  //
  //   fetchUserData();
  // }, []);

  const handleFreeCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/process-free-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basket_items: items,
          user: {
            first_name: firstName,
            surname: surname,
            email,
            kit_subscriber_id: kitSubscriberId,
            subscribed_to_marketing: receiveUpdates,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      const checkoutId = `free_${Date.now()}_${btoa(email).substring(0, 8)}`;
      sessionStorage.setItem(`${checkoutId}`, JSON.stringify(items));

      // Redirect to success page
      window.location.href = `${origin}/checkout-complete?checkout_id=${checkoutId}`;
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "An error occurred processing your free items.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isBasketFree(items)) {
      await handleFreeCheckout(e);
      return;
    }

    // Paid for

    if (!validateForm() || !stripe || !elements) return;

    setIsLoading(true);
    try {
      // Step 1: Update user data in cookies
      // const updatedUserInfo = { firstName, surname, email };
      //
      // const response = await fetch("/api/set-user-cookie", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(updatedUserInfo),
      // });
      //
      // const data = await response.json();
      // console.log(
      //   "CheckoutForm: response from set-user-cookie: " + data.message,
      // );

      // Step 1: Store user and unconfirmed payment details in supabase
      const response = await fetch("/api/sb-insert-unconfirmed-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          basket_items: items,
          user: {
            first_name: firstName,
            surname: surname,
            email,
            kit_subscriber_id: kitSubscriberId,
            subscribed_to_marketing: receiveUpdates,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        // Log error but don't fail payment
        console.error("Error creating a purchase on the server:", data.message);
        setMessage(data.message);
      }

      // Step 2: Confirm payment using Stripe
      // Store items in sessionStorage before payment confirmation
      sessionStorage.setItem(`${paymentIntentId}`, JSON.stringify(items));

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${origin}/checkout-complete?checkout_id=${paymentIntentId}`,
          payment_method_data: {
            billing_details: {
              name: `${firstName} ${surname}`,
              email: email,
            },
          },
        },
      });

      // WE'VE NOW REDIRECTED
      // NO CODE BELOW HERE WILL BE RUN

      if (error) {
        setMessage(error.message || "An unexpected error occurred.");
      } else {
        setMessage(null);
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Define PaymentElement options as an object (no exported type available)
  const paymentElementOptions: Record<string, string> = {
    layout: "accordion", // Customize the PaymentElement layout
  };

  const getButtonText = () => {
    if (isLoading) return <div className="spinner" id="spinner"></div>;
    return isBasketFree(items) ? "Complete Registration" : "Pay now";
  };

  return (
    <div className="checkout-container">
      {message && <p className="form-error-message">{message}</p>}
      <form id="payment-form" onSubmit={handleSubmit} noValidate>
        <h2 className="checkout-heading">
          Enter your details for ticket delivery
        </h2>

        {/* Input for First Name */}
        <div
          className={`checkout-form-field ${
            errors.firstName ? "field-error" : ""
          }`}
        >
          <label htmlFor="first-name">First Name</label>
          <input
            id="first-name"
            type="text"
            value={firstName}
            onChange={handleFirstNameChange} // Handle live error clearing
            className="checkout-input"
          />
          {errors.firstName && (
            <p className="error-message">{errors.firstName}</p>
          )}
        </div>

        {/* Input for Surname */}
        <div
          className={`checkout-form-field ${errors.surname ? "field-error" : ""}`}
        >
          <label htmlFor="surname">Surname</label>
          <input
            id="surname"
            type="text"
            value={surname}
            onChange={handleSurnameChange} // Handle live error clearing
            className="checkout-input"
          />
          {errors.surname && <p className="error-message">{errors.surname}</p>}
        </div>

        {/* Input for Email */}
        <div
          className={`checkout-form-field ${errors.email ? "field-error" : ""}`}
        >
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            className="checkout-input"
            disabled={isCheckingKit} // Disable input while checking ConvertKit
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        {/* STRIPE PAYMENT ELEMENT */}
        {!isBasketFree(items) && (
          <>
            <h2 className="checkout-heading">Choose your payment method</h2>

            <div className="checkout-payment-element">
              <PaymentElement
                id="payment-element"
                options={paymentElementOptions}
              />
            </div>
          </>
        )}

        {/* Checkbox for Terms and Conditions */}
        <div
          className={`checkout-checkbox ${errors.terms ? "field-error" : ""}`}
        >
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={handleTermsChange} // Handle live checkbox validation
              style={{ marginRight: "8px" }}
            />
            I agree to the &nbsp;
            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
            >
              terms and conditions
            </a>
            .
          </label>
          {errors.terms && <p className="error-message">{errors.terms}</p>}
        </div>

        {/* Updates checkbox - displayed conditionally */}
        {showUpdatesCheckbox && (
          <div className="checkout-checkbox">
            <label>
              <input
                type="checkbox"
                checked={receiveUpdates}
                onChange={(e) => setReceiveUpdates(e.target.checked)}
              />
              I would like to receive offers and news from Naomi.
            </label>
          </div>
        )}

        <button
          className="checkout-submit-button"
          disabled={
            isLoading || (!isBasketFree(items) && (!stripe || !elements))
          }
          id="submit"
        >
          <span id="button-text">{getButtonText()}</span>
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
