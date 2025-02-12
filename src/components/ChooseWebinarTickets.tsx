import React, { useState } from "react";
import "./overlay.css"; // Overlay styles
import { useCart } from "react-use-cart";
import type { Ticket } from "../types/webinar";
import BasketComponent from "./BasketComponent";
import type { BasketAndCheckoutItem } from "../types/basket-and-checkout-item";

interface TicketSelectionOverlayProps {
  ticketClasses: Ticket[];
  webinarId: string;
  onClose: () => void;
}

const TicketSelectionOverlay: React.FC<TicketSelectionOverlayProps> = ({
  ticketClasses,
  webinarId,
  onClose,
}) => {
  const { addItem, removeItem, inCart } = useCart();

  const handleAddToBasket = async (ticket: Ticket) => {
    const id = `${webinarId}_${ticket.id}`;
    if (!inCart(id)) {
      // Fetch ticket details and add to basket
      try {
        const response = await fetch(`/api/webinar-tickets/${id}`);
        const basketAndCheckoutItem: BasketAndCheckoutItem =
          await response.json(); // Parse the JSON response
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        addItem(basketAndCheckoutItem);
      } catch (error) {
        console.error("Error adding ticket to basket:", error);
      }
    }
  };

  const handleRemoveFromBasket = (ticket: Ticket) => {
    const id = `${webinarId}_${ticket.id}`;
    if (inCart(id)) {
      removeItem(id);
    }
  };

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="overlay-content"
        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
      >
        <h2>Choose Ticket</h2>

        {/* Display Ticket Options */}
        {ticketClasses.map((ticket) => (
          <div key={ticket.id} style={{ marginBottom: "10px" }}>
            <span>
              {ticket.display_name} - {ticket.cost?.display ?? "Free"}
            </span>
            {inCart(`${webinarId}_${ticket.id}`) ? (
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => handleRemoveFromBasket(ticket)}
              >
                Remove from Basket
              </button>
            ) : (
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => handleAddToBasket(ticket)}
              >
                Add to Basket
              </button>
            )}
          </div>
        ))}

        {/* Always Display Basket at the Bottom */}
        <div style={{ marginTop: "20px" }}>
          <BasketComponent />
        </div>

        {/* Close Button */}
        <button onClick={onClose} style={{ marginTop: "20px" }}>
          Close
        </button>
      </div>
    </div>
  );
};

interface TicketSelectorButtonProps {
  ticketClasses: Ticket[];
  webinarId: string;
}

const TicketSelectorButton: React.FC<TicketSelectorButtonProps> = ({
  ticketClasses,
  webinarId,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      <button onClick={() => setShowOverlay(true)}>Select Tickets</button>
      {showOverlay && (
        <TicketSelectionOverlay
          webinarId={webinarId}
          ticketClasses={ticketClasses}
          onClose={() => {
            console.log("Overlay close triggered!");
            setShowOverlay(false);
          }}
        />
      )}
    </>
  );
};

export default TicketSelectorButton;
