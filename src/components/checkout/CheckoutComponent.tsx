import React, { useState, useEffect } from "react";
import { Basket } from "../basket/Basket.tsx";
import { UserDetailsForm } from "./UserDetailsForm.tsx";
import { StripePaymentComponent } from "./StripePaymentComponent.tsx";
import { PayPalPaymentComponent } from "./PayPalPaymentComponent.tsx";
import { FreePaymentComponent } from "./FreePaymentComponent.tsx";
import { useClientOnly } from "../../scripts/basket/use-client-only-hook.ts";

import formStyles from "../../styles/components/checkout/form.module.css";
import cartStyles from "../../styles/components/cart/cart.module.css";
import paymentStyles from "../../styles/components/checkout/payment.module.css";
import { useStore } from "@nanostores/react";
import { getBasketItems, getIsEmpty } from "../../scripts/basket/basket.ts";
import type { User } from "../../types/user";
import { getTrackerFromStore } from "../../scripts/tracking/trackerRetrieverAndStorer.ts";
import {
  META_BASKET_PRODUCT_TYPE,
  type MetaBasketProductType,
  trackCheckoutEvent,
} from "../../scripts/tracking/metaPixel.ts";
import { PRODUCT_TYPE, type ProductType } from "../../types/basket-item..ts";

type PaymentMethod = "paypal" | "apple_pay" | "google_pay" | "card";

const Checkout: React.FC<{ setError: (error: string | null) => void }> = ({
                                                                            setError,
                                                                          }) => {
  const $basketItems = useStore(getBasketItems);
  const $isEmpty = useStore(getIsEmpty);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const isBasketFree = (items: any[]): boolean => {
    return items.every((item) => item.discountedPriceInPence === 0);
  };

  const handleUserDetailsComplete = async (user: User) => {
    setUserDetails(user);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handleBackToPaymentMethods = () => {
    setSelectedPaymentMethod(null);
  };

  if ($isEmpty) {
    return null;
  }

  // Show user details form if we don't have user details yet
  if (!userDetails) {
    return (
      <div className={formStyles.checkoutFormWrapper}>
        <UserDetailsForm onComplete={handleUserDetailsComplete} />
      </div>
    );
  }

  // For free items, use dedicated free component
  if (isBasketFree($basketItems)) {
    return (
      <div className={formStyles.checkoutFormWrapper}>
        <FreePaymentComponent
          userDetails={userDetails}
          basketItems={$basketItems}
          setError={setError}
        />
      </div>
    );
  }

  return (
    <div className={formStyles.checkoutFormWrapper}>
      {!selectedPaymentMethod ? (
        // Payment method selection screen
        <div style={{ marginBottom: "20px" }}>
          <h2>Select Payment Method</h2>
          <div className={paymentStyles.paymentMethodGrid}>
            <button
              className={paymentStyles.paymentMethodButton}
              onClick={() => handlePaymentMethodSelect("paypal")}
            >
              <span className={paymentStyles.paymentMethodIcon}>💳</span>
              Pay with PayPal
            </button>

            <StripePaymentComponent
              userDetails={userDetails}
              basketItems={$basketItems}
              setError={setError}
              onPaymentMethodSelect={handlePaymentMethodSelect}
              showButtonsOnly={true}
            />
          </div>
        </div>
      ) : selectedPaymentMethod === "paypal" ? (
        // PayPal payment screen
        <div>
          <div className={paymentStyles.backButtonContainer}>
            <button
              className={paymentStyles.backButton}
              onClick={handleBackToPaymentMethods}
            >
              ← Back to payment methods
            </button>
          </div>
          <PayPalPaymentComponent
            userDetails={userDetails}
            basketItems={$basketItems}
            setError={setError}
          />
        </div>
      ) : (
        // Stripe payment forms (Apple Pay, Google Pay, or Card)
        <div>
          <div className={paymentStyles.backButtonContainer}>
            <button
              className={paymentStyles.backButton}
              onClick={handleBackToPaymentMethods}
            >
              ← Back to payment methods
            </button>
          </div>
          <StripePaymentComponent
            userDetails={userDetails}
            basketItems={$basketItems}
            setError={setError}
            selectedPaymentMethod={selectedPaymentMethod}
            showButtonsOnly={false}
          />
        </div>
      )}
    </div>
  );
};

const CheckoutComponent: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const isClient = useClientOnly();
  const $basketItems = useStore(getBasketItems);
  const [hasTracked, setHasTracked] = useState<boolean>(false);

  useEffect(() => {
    if (hasTracked || !isClient || $basketItems.length === 0) return;

    setHasTracked(true);

    if (isClient && $basketItems.length > 0) {
      const basketItemIds = $basketItems
        .map((item) => item.id)
        .sort()
        .join("-");
      const eventId = `checkout-${basketItemIds}`;

      if (!sessionStorage.getItem(eventId)) {
        const cart = $basketItems.map((item) => ({
          id: item.id,
          quantity: 1,
          item_price: item.discountedPriceInPence / 100,
          content_type: item.product_type as ProductType,
        }));

        const contentType: MetaBasketProductType = cart.every(
          (item) => item.content_type === PRODUCT_TYPE.WEBINAR,
        )
          ? META_BASKET_PRODUCT_TYPE.WEBINARS
          : cart.every((item) => item.content_type === PRODUCT_TYPE.COURSE)
            ? META_BASKET_PRODUCT_TYPE.COURSES
            : META_BASKET_PRODUCT_TYPE.MIXED;

        const eventData = {
          value: cart.reduce(
            (sum, item) => sum + item.item_price * item.quantity,
            0,
          ),
          currency: "GBP",
          contents: cart,
          content_type: contentType,
        };

        trackCheckoutEvent(eventData, { eventID: eventId });
        sessionStorage.setItem(eventId, "true");
      }
    }
  }, [isClient, $basketItems]);

  if (!isClient) {
    return null;
  }

  return (
    <div className={cartStyles.cartAndCheckout}>
      {error && <div className={formStyles.error}>{error}</div>}
      <Basket showCheckoutButton={false} basketTitle={"Order Summary"} />
      <Checkout setError={setError} />
    </div>
  );
};

export default CheckoutComponent;