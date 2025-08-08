import { useState } from "react";

export const userDetailsFormStateAndValidation = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState({
    firstName: "",
    surname: "",
    email: "",
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
    errors,
    setErrors,
    validateForm,
    validateEmail,
  };
};
