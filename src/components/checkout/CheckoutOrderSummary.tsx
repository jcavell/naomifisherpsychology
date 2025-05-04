import React from "react";
import type { BasketItem } from "../../types/basket-item";
import {formatAmount} from "../../scripts/basket/utils.ts";

interface LineItemsSummaryProps {
  items: BasketItem[];
  total: number; // Total price in pence
}

const CheckoutSummary: React.FC<LineItemsSummaryProps> = ({ items, total }) => {
  return (
    <div className="line-items-summary">
      <h3>Basket</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="line-item">
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
            <div className="item-details">
              <strong>{item.product_name}</strong>
              <p>Price: £{formatAmount(item.price)}</p>
            </div>
          </li>
        ))}
      </ul>
      <h4>Total: £{formatAmount(total)}</h4>
    </div>
  );
};

export default CheckoutSummary;
