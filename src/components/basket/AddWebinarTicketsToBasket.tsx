import React, { useEffect, useState } from "react";
import AddToBasketComponent from "./AddToBasketComponent.tsx";
import type { WebinarTicket } from "../../types/webinar";
import { DiscountedPrice } from "./DiscountedPrice.tsx";

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
    <>
      {tickets
        .filter((ticket) => !ticket.hidden)
        .map((ticket) => (
          <div className="purchase" key={ticket.id}>
            <div className="price">
              <DiscountedPrice
                offerId={webinarId}
                priceInPence={ticket.costValue ? ticket.costValue : 0}
              />
            </div>
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
    </>
  );
};

export default AddWebinarTicketsToBasket;
