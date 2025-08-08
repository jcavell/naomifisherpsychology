import { userDetailsFormStateAndValidation } from "./UserDetailsFormStateAndValidation.ts";
import React, { useState } from "react";
import formStyles from "../../styles/components/checkout/form.module.css";
import cartStyles from "../../styles/components/cart/cart.module.css";
import type { User } from "../../types/user";

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
