import React, { useState } from "react";
import { CartProvider } from "react-use-cart";
import AddToBasketComponent from "./AddToBasketComponent.tsx";
import type { WebinarTicket } from "../../types/webinar";

interface AddWebinarTicketsToBasketProps {
  tickets: WebinarTicket[];
  webinarId: string;
}

const AddWebinarTicketsToBasket: React.FC<AddWebinarTicketsToBasketProps> = ({
  tickets,
  webinarId,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <CartProvider id="website">
      {tickets
        .filter((ticket) => !ticket.hidden)
        .map((ticket) => (
          <div className="purchase" key={ticket.id}>
            <div className="price">{ticket.costPlusFee}</div>
            {/* Render ticket display name */}
            <div>{ticket.name}</div>

            <div style={{ marginLeft: "auto" }}>
              <AddToBasketComponent
                id={`${webinarId}_${ticket.id}`}
                type="webinar"
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>
          </div>
        ))}
    </CartProvider>
  );
};

export default AddWebinarTicketsToBasket;
