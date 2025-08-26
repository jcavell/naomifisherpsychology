import React, { useState, useEffect } from "react";
import formStyles from "../../styles/components/checkout/form.module.css";
import paymentStyles from "../../styles/components/checkout/payment.module.css";
import type { User } from "../../types/user";

interface TermsNewsletterSubmitComponentProps {
  userDetails: User;
  onSubmit: (formData: {
    agreedToTerms: boolean;
    receiveUpdates: boolean;
    kitSubscriberId: string | null;
  }) => Promise<boolean> | boolean;
  isLoading: boolean;
  disabled: boolean;
  submitText: string;
}

export const TermsNewsletterSubmitComponent: React.FC<
  TermsNewsletterSubmitComponentProps
> = ({ userDetails, onSubmit, isLoading, disabled, submitText }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [showUpdatesCheckbox, setShowUpdatesCheckbox] = useState(false);
  const [kitSubscriberId, setKitSubscriberId] = useState<string | null>(null);
  const [isCheckingKit, setIsCheckingKit] = useState(false);

  // Check Kit subscriber status
  useEffect(() => {
    const checkKitSubscriber = async () => {
      setIsCheckingKit(true);
      try {
        const res = await fetch(
          `/api/get-kit-user?email=${encodeURIComponent(userDetails.email)}`,
        );
        const data = await res.json();

        if (res.ok && data.subscriber) {
          setKitSubscriberId(data.subscriber.id);
          setShowUpdatesCheckbox(false);
        } else {
          setKitSubscriberId(null);
          setShowUpdatesCheckbox(true);
        }
      } catch (error) {
        console.error("Error checking subscriber:", error);
      } finally {
        setIsCheckingKit(false);
      }
    };

    checkKitSubscriber();
  }, [userDetails.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      agreedToTerms,
      receiveUpdates,
      kitSubscriberId,
    };

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={formStyles.checkbox}>
        <label>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            required
          />
          <span>
            I agree to the{" "}
            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
            >
              terms and conditions
            </a>
          </span>
        </label>
      </div>

      {showUpdatesCheckbox && (
        <div className={formStyles.checkbox}>
          <label>
            <input
              type="checkbox"
              checked={receiveUpdates}
              onChange={(e) => setReceiveUpdates(e.target.checked)}
            />
            I would like to receive offers and news from Naomi
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !agreedToTerms || disabled || isCheckingKit}
        className={paymentStyles.checkoutSubmitButton}
      >
        {isLoading ? "Processing..." : submitText}
      </button>
    </form>
  );
};
