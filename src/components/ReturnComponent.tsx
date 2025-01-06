import React, { useCallback, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { CartProvider, useCart } from "react-use-cart";

const ReturnElement = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(`/api/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  if (status === "complete") {
    const { emptyCart } = useCart();
    emptyCart();
    return (
      <section id="success">
        <p>
          Thank you for your purchase A confirmation email will be sent to{" "}
          {customerEmail}. If you have any questions, please email{" "}
          <a href="mailto:support@naomifisher.co.uk">
            support@naomifisher.co.uk
          </a>
          .
        </p>
      </section>
    );
  }

  return null;
};

const ReturnComponent: React.FC = () => {
  return (
    <CartProvider id="website">
      <ReturnElement />
    </CartProvider>
  );
};

export default ReturnComponent;
