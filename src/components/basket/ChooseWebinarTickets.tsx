import React, { useState, useEffect, useCallback } from "react";
import "./overlay.css"; // Overlay styles
import { useCart } from "react-use-cart";
import type { Ticket, Webinar } from "../../types/webinar";
import Basket from "./Basket.tsx";
import type { BasketAndCheckoutItem } from "../../types/basket-and-checkout-item";

interface TicketSelectionOverlayProps {
  webinar: Webinar;
  onModifiedClose: () => void; // Notify modifications occurred and close
  onCloseWithoutModification: () => void; // Close without modifications
}

const TicketSelectionOverlay: React.FC<TicketSelectionOverlayProps> = ({
  webinar,
  onModifiedClose,
  onCloseWithoutModification,
}) => {
  const { addItem, removeItem, inCart } = useCart();
  const [hasModified, setHasModified] = useState(false); // Local flag for modifications

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
      setHasModified(true); // Mark as modified locally
    }
  };

  const handleRemoveFromBasket = (ticket: Ticket) => {
    setHasModified(true); // Mark as modified locally
    const id = `${webinar.id}_${ticket.id}`;
    try {
      if (inCart(id)) {
        console.log("Removing from basket", id);
        removeItem(id);
      } else {
        console.warn("Ticket is not in the cart, nothing to remove");
      }
    } catch (error) {
      console.error("Error in handleRemoveFromBasket:", error);
    }
  };

  // Callback to detect when an item is removed directly from the basket
  const handleItemRemovedFromBasket = () => {
    console.log("Item removed from Basket component");
    setHasModified(true); // Mark as modified
  };

  const handleClose = () => {
    if (hasModified) {
      onModifiedClose(); // Notify parent of modifications
    } else {
      onCloseWithoutModification(); // Notify no modifications
    }
  };

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
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
                  onClick={() => {
                    handleRemoveFromBasket(ticket); // Call the handler
                  }}
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
          <Basket onItemRemoved={handleItemRemovedFromBasket} />
        </div>
        {/* Close Button */}
        <button onClick={handleClose} style={{ marginTop: "20px" }}>
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

  const handleCloseWithoutModification = useCallback(() => {
    console.log("No modifications detected, skipping reload!");
    setShowOverlay(false); // Close overlay
  }, []);

  const handleModifiedClose = useCallback(() => {
    console.log("Modifications detected");
    setShowOverlay(false); // Close overlay
    window.location.reload(); // Reload because no modifications occurred
  }, []);

  const handleOpenOverlay = () => {
    setShowOverlay(true); // Open overlay
  };

  return (
    <>
      <button onClick={handleOpenOverlay}>Select Tickets</button>
      {showOverlay && (
        <TicketSelectionOverlay
          webinar={webinar}
          onModifiedClose={handleModifiedClose}
          onCloseWithoutModification={handleCloseWithoutModification}
        />
      )}
    </>
  );
};

export default TicketSelectorButton;
