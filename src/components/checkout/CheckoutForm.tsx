import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  // State variables to store user details and manage UI state
  const [firstName, setFirstName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State variables for checkboxes
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [receiveUpdates, setReceiveUpdates] = useState<boolean>(false);
  const [showUpdatesCheckbox, setShowUpdatesCheckbox] = useState(false); // NEW: Control visibility of checkbox
  const [isEmailValidating, setIsEmailValidating] = useState(false); // NEW: Track email validation state

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  // Handle email validation and API check to conditionally show checkbox
  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target.value;
    setEmail(emailInput);

    // First, check if email is valid
    if (validateEmail(emailInput)) {
      setIsEmailValidating(true); // Indicate validation in progress
      setErrors((prev) => ({ ...prev, email: "" }));

      try {
        // Check if email exists in ConvertKit via API
        const res = await fetch(`/api/get-kit-user?email=${emailInput}`);
        const data = await res.json();

        if (res.ok && data.subscriber) {
          // User exists in ConvertKit, hide the checkbox
          setShowUpdatesCheckbox(false);
        } else {
          // User does not exist, show the checkbox
          setShowUpdatesCheckbox(true);
        }
      } catch (error) {
        console.error("Error validating email:", error);
        setMessage("An error occurred while validating the email.");
      } finally {
        setIsEmailValidating(false); // Validation complete
      }
    } else {
      // Invalid email format
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
      setShowUpdatesCheckbox(false); // Hide checkbox if email is invalid
    }
  };

  // Field-specific error messages
  const [errors, setErrors] = useState({
    firstName: "",
    surname: "",
    email: "",
    terms: "",
  });

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

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formErrors = { ...errors };

    // Validation: First Name
    if (!firstName.trim()) {
      formErrors.firstName = "Enter your first name.";
    } else {
      formErrors.firstName = "";
    }

    // Validation: Surname
    if (!surname.trim()) {
      formErrors.surname = "Enter your surname.";
    } else {
      formErrors.surname = "";
    }

    // Validation: Email
    if (!email || !validateEmail(email)) {
      formErrors.email = "Enter a valid email address.";
    } else {
      formErrors.email = "";
    }

    // Validation: Terms checkbox
    if (!agreedToTerms) {
      formErrors.terms = "You must agree to the terms and conditions.";
    } else {
      formErrors.terms = "";
    }

    setErrors(formErrors);

    // Check if any errors exist
    const hasErrors = Object.values(formErrors).some((error) => error !== "");
    if (hasErrors) {
      setMessage("Please fix the errors below.");
      return;
    }

    if (!stripe || !elements) {
      // Stripe hasn't loaded yet, disable form submission
      return;
    }

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

      // Step 2: Confirm payment using Stripe

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${origin}/checkout-complete`,
          payment_method_data: {
            billing_details: {
              name: `${firstName} ${surname}`,
              email: email,
            },
          },
        },
      });

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
            onChange={handleEmailChange} // Trigger validation on change
            className="checkout-input"
            disabled={isEmailValidating} // Disable input while validating
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <h2 className="checkout-heading">Choose your payment method</h2>

        {/* Stripe PaymentElement */}
        <div className="checkout-payment-element">
          <PaymentElement />
        </div>

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
            <a href="/terms" target="_blank" rel="noopener noreferrer">
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

        {/* Submit button */}
        <button
          className="checkout-submit-button"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
