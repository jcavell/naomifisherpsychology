import React, { useState } from "react";
import type { BasketItem } from "../../types/basket-item..ts";
import type { User } from "../../types/user";
import { getTrackerFromStore } from "../../scripts/tracking/trackerRetrieverAndStorer.ts";
import { getCouponCodeFromStore } from "../../scripts/coupon/couponRetrieverAndStorer.ts";
import { TermsNewsletterSubmitComponent } from "./TermsNewsletterSubmitComponent.tsx";

interface FreePaymentComponentProps {
  userDetails: User;
  basketItems: BasketItem[];
  setError: (error: string | null) => void;
}

export const FreePaymentComponent: React.FC<FreePaymentComponentProps> = ({
  userDetails,
  basketItems,
  setError,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const processFreeCheckout = async (formData: any) => {
    setIsLoading(true);

    try {
      const checkoutId = `free_${Date.now()}_${btoa(userDetails.email).substring(0, 8)}`;

      const response = await fetch("/api/process-free-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          t: getTrackerFromStore(),
          coupon_code: getCouponCodeFromStore(),
          basket_items: basketItems,
          user: {
            ...userDetails,
            kit_subscriber_id: formData.kitSubscriberId,
            subscribed_to_marketing: formData.receiveUpdates,
          },
        }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).message);
      }

      sessionStorage.setItem(checkoutId, JSON.stringify(basketItems));
      window.location.href = `${window.location.origin}/checkout-complete?checkout_id=${checkoutId}&redirect_status=succeeded`;
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Checkout failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Free Items Checkout</h2>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Your order contains only free items. Complete your order by accepting
        our terms.
      </p>

      <TermsNewsletterSubmitComponent
        userDetails={userDetails}
        onSubmit={processFreeCheckout}
        isLoading={isLoading}
        disabled={false}
        submitText="Complete Order"
      />
    </div>
  );
};
