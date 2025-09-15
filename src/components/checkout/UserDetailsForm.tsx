import { userDetailsFormStateAndValidation } from "./UserDetailsFormStateAndValidation.ts";
import React, { useEffect, useState } from "react";
import formStyles from "../../styles/components/checkout/form.module.css";
import cartStyles from "../../styles/components/cart/cart.module.css";
import type { User } from "../../types/user";
import { getCheckoutSession } from "../../scripts/checkout/checkout-session.ts";

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

  useEffect(() => {
    // Check for existing payment_intent_id query string and associated session
    // Will be the case e.g. if they cancelled a PayPal payment
    const params = new URLSearchParams(window.location.search);
    const paymentIntentId = params.get('payment_intent_id');

    if (paymentIntentId) {
      const sessionData = getCheckoutSession(paymentIntentId)
      if (sessionData) {
        setFirstName(sessionData.firstName);
        setSurname(sessionData.surname);
        setEmail(sessionData.email);
      }
    }
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

    onComplete({
      first_name: firstName,
      surname,
      email,
    });
  };

  return (
    <div className={cartStyles.cartContainer}>
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
