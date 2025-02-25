import { useState } from "react";

export const checkoutFormStateAndValidation = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [receiveUpdates, setReceiveUpdates] = useState<boolean>(false);
  const [showUpdatesCheckbox, setShowUpdatesCheckbox] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    surname: "",
    email: "",
    terms: "",
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let formErrors = { ...errors };

    if (!firstName.trim()) formErrors.firstName = "Enter your first name.";
    if (!surname.trim()) formErrors.surname = "Enter your surname.";
    if (!email || !validateEmail(email))
      formErrors.email = "Enter a valid email address.";
    if (!agreedToTerms)
      formErrors.terms = "You must agree to the terms and conditions.";

    setErrors(formErrors);
    return !Object.values(formErrors).some((error) => error !== "");
  };

  return {
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
  };
};
