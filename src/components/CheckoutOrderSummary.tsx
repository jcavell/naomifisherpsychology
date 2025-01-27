import React from "react";
import { Stripe } from "stripe";
import type { LineItem } from "../types/LineItem.d.ts";

interface LineItemsSummaryProps {
  items: LineItem[]; // Type each line item
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
            {/* Display the first image in the array if available */}
            {item.product_data.images &&
              item.product_data.images.length > 0 && (
                <img
                  src={item.product_data.images[0]} // Grab the first image in the array
                  alt={item.product_data.name}
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
              <strong>{item.product_data.name}</strong>
              <p>Price: £{formatAmount(item.unit_amount)}</p>
            </div>
          </li>
        ))}
      </ul>
      {/* Display the total price */}
      <h4>Total: £{formatAmount(total)}</h4>
    </div>
  );
};

export default LineItemsSummary;
