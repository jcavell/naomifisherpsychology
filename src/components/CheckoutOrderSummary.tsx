import React from "react";
import type { CheckoutItem } from "../types/checkoutItem";

interface LineItemsSummaryProps {
  items: CheckoutItem[];
  total: number; // Total price in pence
}

const CheckoutSummary: React.FC<LineItemsSummaryProps> = ({ items, total }) => {
  // Function to format the amount into a readable price
  const formatAmount = (amount: number) => (amount / 100).toFixed(2);

  return (
    <div className="line-items-summary">
      <h3>Order Summary</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="line-item">
            {/* Display the first image in the array if available */}
            {item.product_images && item.product_images.length > 0 && (
              <img
                src={item.product_images[0]} // Grab the first image in the array
                alt={item.product_name}
                className="product-image"
                style={{
                  width: "75px", // Increased size
                  height: "75px",
                  marginRight: "10px",
                }}
              />
            )}
            {/* Display each item's details */}
            <div className="item-details">
              <strong>{item.product_name}</strong>
              <p>Price: £{formatAmount(item.price)}</p>
            </div>
          </li>
        ))}
      </ul>
      {/* Display the total price */}
      <h4>Total: £{formatAmount(total)}</h4>
    </div>
  );
};

export default CheckoutSummary;
