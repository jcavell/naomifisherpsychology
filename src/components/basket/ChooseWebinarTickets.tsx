import React, { useState, useEffect, useCallback } from "react";
import "./overlay.css"; // Overlay styles
import { useCart } from "react-use-cart";
import type { Ticket, Webinar } from "../../types/webinar";
import Basket from "./Basket.tsx";
import type { BasketAndCheckoutItem } from "../../types/basket-and-checkout-item";

interface TicketSelectionOverlayProps {
  webinar: Webinar;
  onClose: () => void;
}

const TicketSelectionOverlay: React.FC<
  TicketSelectionOverlayProps & { reloadBasket: boolean }
> = ({ webinar, reloadBasket, onClose }) => {
  const { addItem, removeItem, inCart, emptyCart, items } = useCart();

  useEffect(() => {
    console.log("Reloading basket for webinar:", webinar.id);

    // 2. If the cart is already empty, stop here to avoid unnecessary operations
    if (items.length === 0) {
      console.warn("Basket is already empty. Nothing to reload.");
    }
  }, [reloadBasket, webinar.id]);

  const handleAddToBasket = async (ticket: Ticket) => {
    const id = `${webinar.id}_${ticket.id}`;
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
    const id = `${webinar.id}_${ticket.id}`;
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
        <h2>{webinar.name.text}</h2>
        {`${webinar.day} ${webinar.month}`} at {`${webinar.startTime}`}
        {/* Ticket Options (non-hidden) */}
        {webinar.ticket_classes
          .filter((t) => !t.hidden)
          .map((ticket) => (
            <div key={ticket.id} style={{ marginBottom: "10px" }}>
              <span>
                {ticket.display_name} - {ticket.cost?.display ?? "Free"}
              </span>
              {inCart(`${webinar.id}_${ticket.id}`) ? (
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
          <Basket />
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
  webinar: Webinar;
}

const TicketSelectorButton: React.FC<TicketSelectorButtonProps> = ({
  webinar,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [reloadBasket, setReloadBasket] = useState(false); // Track when to reload the basket

  const handleOpenOverlay = () => {
    setShowOverlay(true); // Show the overlay
    setReloadBasket((prev) => !prev); // Toggle reloadBasket (used to force refresh)
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <>
      <button onClick={handleOpenOverlay}>Select Tickets</button>
      {showOverlay && (
        <TicketSelectionOverlay
          webinar={webinar}
          onClose={handleCloseOverlay}
        />
      )}
    </>
  );
};

export default TicketSelectorButton;
