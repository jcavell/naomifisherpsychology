import React, { useState, useEffect, useCallback } from "react";
import styles from "../../styles/components/cart/overlay.module.css";
import { useCart } from "react-use-cart";
import type { Ticket, Webinar } from "../../types/webinar";
import Basket from "./Basket";
import type { BasketItem } from "../../types/basket-item";

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
  const [loading, setLoading] = useState<string | null>(null); // Keeps track of loading ticket ID
  const [isAnyButtonLoading, setIsAnyButtonLoading] = useState(false); // New state

  const handleAddToBasket = async (ticket: Ticket) => {
    const id = `${webinar.id}_${ticket.id}`;
    if (!inCart(id)) {
      setLoading(id); // Set loading state for this ticket
      setIsAnyButtonLoading(true); // Set global loading state

      // Fetch ticket details and add to basket
      try {
        const response = await fetch(`/api/webinar-tickets/${id}`);
        const basketItem: BasketItem = await response.json(); // Parse the JSON response
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        addItem(basketItem);
      } catch (error) {
        console.error("Error adding ticket to basket:", error);
      } finally {
        setLoading(null); // Clear loading state after completion
        setIsAnyButtonLoading(false); // Clear global loading state
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
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={styles.overlayContent}
        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
      >
        {/* Cross Button for Close */}
        <button
          type="button"
          className={styles.closeOverlayButton}
          onClick={handleClose}
        >
          &times;
        </button>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={webinar.logo.original.url}
            alt={`${webinar.name.text} logo`}
            style={{
              width: "40px", // Adjust the size of the image
              height: "auto",
              borderRadius: "4px",
            }}
          />
          {webinar.name.text}
        </h2>
        {`${webinar.day} ${webinar.month}`} at {`${webinar.startTime}`}
        {webinar.ticket_classes.some((ticket) =>
          inCart(`${webinar.id}_${ticket.id}`),
        ) ? (
          <p>
            {
              webinar.ticket_classes.find((ticket) =>
                inCart(`${webinar.id}_${ticket.id}`),
              )?.display_name
            }{" "}
            is in your basket.
          </p>
        ) : (
          webinar.ticket_classes
            .filter((ticket) => !ticket.hidden)
            .map((ticket) => (
              <div className={styles.ticketRow} key={ticket.id}>
                <span className={styles.ticketName}>{ticket.display_name}</span>
                <span className={styles.ticketCost}>
                  {ticket.cost?.display ?? "Free"}
                </span>
                <button
                  type="button"
                  className={styles.addToBasket}
                  onClick={() => handleAddToBasket(ticket)}
                  disabled={isAnyButtonLoading} // Use global loading state
                >
                  {loading === `${webinar.id}_${ticket.id}` ? (
                    <span className={styles.spinner} />
                  ) : (
                    "Add to Basket"
                  )}
                </button>
              </div>
            ))
        )}
        {/* Always Display Basket at the Bottom */}
        <div style={{ marginTop: "20px" }}>
          <Basket
            showEmptyBasketMessage={false}
            onItemRemoved={handleItemRemovedFromBasket}
          />
        </div>
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
      <button type="button" onClick={handleOpenOverlay}>
        Select Tickets
      </button>
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
