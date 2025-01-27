// AddWebinarTicketsToBasket.tsx
import React from "react";
import { CartProvider } from "react-use-cart";
import AddToBasketComponent from "./AddToBasketComponent";
import type { ProcessedTicket } from "../types/webinar"; // Update the path to match where your `Ticket` type is defined

interface AddWebinarTicketsToBasketProps {
  tickets: ProcessedTicket[];
  webinarId: string;
}

const AddWebinarTicketsToBasket: React.FC<AddWebinarTicketsToBasketProps> = ({
  tickets,
  webinarId,
}) => {
  return (
    <CartProvider id="website">
      {tickets
        .filter((ticket) => !ticket.hidden)
        .map((ticket) => (
          <div className="purchase" key={ticket.id}>
            <div className="price">{ticket.costPlusFee}</div>
            {/* Render ticket display name */}
            <div className="company eventbrite">{ticket.name}</div>

            {/* Add to Basket Component */}
            <AddToBasketComponent
              id={`${webinarId}_${ticket.id}`}
              type="webinar"
            />
          </div>
        ))}
    </CartProvider>
  );
};

export default AddWebinarTicketsToBasket;
