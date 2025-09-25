import { userDetailsFormStateAndValidation } from "./UserDetailsFormStateAndValidation.ts";
import React, { useEffect, useState } from "react";
import formStyles from "../../styles/components/checkout/form.module.css";
import cartStyles from "../../styles/components/cart/cart.module.css";
import type { User } from "../../types/user";
import type { PurchaseData } from "../../pages/api/sb-get-purchase-from-session-id.ts";
import { trackInitiateCheckoutEvent } from "../../scripts/tracking/track-events.ts";
import { persistentCoupon } from "../../scripts/coupon/couponStore.ts";
import { getBasketItems } from "../../scripts/basket/basket.ts";

interface UserDetailsFormProps {
  onComplete: (userDetails: User) => Promise<void>;
}

export const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
  onComplete,
}) => {
  const {
    firstName,
    setFirstName,
    surname,
    setSurname,
    email,
    setEmail,
    errors,
    setErrors,
    validateForm,
    validateEmail,
  } = userDetailsFormStateAndValidation();

  const [showCancelMessage, setShowCancelMessage] = useState(false);

  useEffect(() => {
    const fetchPurchaseData = async () => {
      const params = new URLSearchParams(window.location.search);
      // Only pre-fill form is the payment is cancelled
      const paymentCancelled = params.get("payment_cancelled");

      if (paymentCancelled) {
        setShowCancelMessage(true);
        try {
          const response = await fetch("/api/sb-get-purchase-from-session-id", {
            method: "GET",
            credentials: "include",
          });

          if (response.ok) {
            const data: PurchaseData = await response.json();
            console.log("DATA", data);
            setFirstName(data.Users.first_name);
            setSurname(data.Users.surname);
            setEmail(data.Users.email);
          }
        } catch (error) {
          console.error("Error fetching purchase data:", error);
        }
      }
    };

    // Call the async function
    fetchPurchaseData();
  }, []);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    if (e.target.value.trim() !== "") {
      setErrors((prev) => ({ ...prev, firstName: "" }));
    }
  };

  const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurname(e.target.value);
    if (e.target.value.trim() !== "") {
      setErrors((prev) => ({ ...prev, surname: "" }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target.value;
    setEmail(emailInput);

    if (!validateEmail(emailInput)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userDetails: User = {
      first_name: firstName,
      surname,
      email,
    };

    // Get basket items and coupon code from stores
    const basketItems = getBasketItems.get();
    const couponCode = persistentCoupon.get();

    // Meta tracking
    trackInitiateCheckoutEvent(basketItems, userDetails);

    onComplete(userDetails);
  };

  return (
    <div className={cartStyles.cartContainer}>
      {showCancelMessage && (
        <div
          className={formStyles.errorMessage}
          style={{ marginBottom: "1rem", textAlign: "center" }}
        >
          Payment has been cancelled. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <h2>Your details</h2>

        <div
          className={`${formStyles.formField} ${errors.firstName ? formStyles.fieldError : ""}`}
        >
          <label htmlFor="first-name">First Name</label>
          <input
            id="first-name"
            type="text"
            value={firstName}
            onChange={handleFirstNameChange}
            className={formStyles.input}
          />
          {errors.firstName && (
            <p className={formStyles.errorMessage}>{errors.firstName}</p>
          )}
        </div>

        <div
          className={`${formStyles.formField} ${errors.surname ? formStyles.fieldError : ""}`}
        >
          <label htmlFor="surname">Surname</label>
          <input
            id="surname"
            type="text"
            value={surname}
            onChange={handleSurnameChange} // Handle live error clearing
            className={formStyles.input}
          />
          {errors.surname && (
            <p className={formStyles.errorMessage}>{errors.surname}</p>
          )}
        </div>

        <div
          className={`${formStyles.formField} ${errors.email ? formStyles.fieldError : ""}`}
        >
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            className={formStyles.input}
          />
          {errors.email && (
            <p className={formStyles.errorMessage}>{errors.email}</p>
          )}
        </div>

        <div className={cartStyles.buttonContainer}>
          <button
            type="submit"
            className={cartStyles.checkoutButton}
            disabled={!email || !validateEmail(email) || !firstName || !surname}
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};
