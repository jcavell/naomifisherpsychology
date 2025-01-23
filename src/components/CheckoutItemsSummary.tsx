import React from "react";
import { Stripe } from "stripe";

interface LineItemsSummaryProps {
  items: Stripe.Checkout.SessionCreateParams.LineItem[]; // Type each line item
  total: number; // Total price in pence
}

const LineItemsSummary: React.FC<LineItemsSummaryProps> = ({
  items,
  total,
}) => {
  // Function to format the amount into a readable price
  const formatAmount = (amount: number) => (amount / 100).toFixed(2);

  return (
    <div className="line-items-summary">
      <h3>Order Summary</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="line-item">
            {/* Display each item's details */}
            <strong>
              {item.price_data?.product_data?.name || "Unknown Item"}
            </strong>
            {/*<p>*/}
            {/*  {item.price_data?.product_data?.description ||*/}
            {/*    "No description available."}*/}
            {/*</p>*/}
            {/*<p>Quantity: {item.quantity}</p>*/}
            <p>Price: £{formatAmount(item.price_data?.unit_amount ?? 0)}</p>
          </li>
        ))}
      </ul>
      {/* Display the total price */}
      <h4>Total: £{formatAmount(total)}</h4>
    </div>
  );
};

export default LineItemsSummary;
