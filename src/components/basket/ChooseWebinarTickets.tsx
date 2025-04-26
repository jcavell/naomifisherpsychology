import React, { useState, useEffect, useCallback } from "react";
import styles from "../../styles/components/cart/overlay.module.css";
import { useCart } from "react-use-cart";
import type { WebinarTicket, Webinar } from "../../types/webinar";
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

  const getId = (ticket: WebinarTicket) => `${webinar.id}_${ticket.id}`;

  const handleAddToBasket = async (ticket: WebinarTicket) => {
    const id = getId(ticket);
    if (!inCart(id)) {
      setLoading(id);
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

  const handleRemoveFromBasket = (ticket: WebinarTicket) => {
    setHasModified(true); // Mark as modified locally
    const id = getId(ticket);
    try {
      if (inCart(id)) {
        removeItem(id);
      } else {
        console.warn("EventbriteTicket is not in the cart, nothing to remove");
      }
    } catch (error) {
      console.error("Error in handleRemoveFromBasket:", error);
    }
  };

  // Callback to detect when an item is removed directly from the basket
  const handleItemRemovedFromBasket = () => {
    setHasModified(true);
  };

  const handleClose = () => {
    if (hasModified) {
      onModifiedClose(); // Notify parent of modifications
    } else {
      onCloseWithoutModification(); // Notify no modifications
    }
  };

  const ticketsInCart = webinar.tickets.map((ticket) => inCart(getId(ticket)));
  // Then check if any are true
  const hasTicketInCart = ticketsInCart.includes(true);

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
        <div className={styles.overlayTitle}>
          <p>{webinar.title}</p>
          <p>
            {" "}
            {`${webinar.day} ${webinar.month}`} at {`${webinar.startTime}`}
          </p>
        </div>
        {hasTicketInCart ? (
          <p className={styles.inBasketMessage}>
            This webinar is in your basket
          </p>
        ) : (
          webinar
            .tickets!.filter((ticket) => !ticket.hidden)
            .map((ticket) => (
              <div className={styles.ticketRow} key={ticket.id}>
                <span className={styles.ticketName}>{ticket.name}</span>
                <span className={styles.ticketCost}>{ticket.costPlusFee}</span>
                <button
                  type="button"
                  className={styles.addToBasket}
                  onClick={() => handleAddToBasket(ticket)}
                  disabled={isAnyButtonLoading} // Use global loading state
                >
                  {loading === getId(ticket) ? (
                    <span className={styles.spinner} />
                  ) : (
                    "Add to Basket"
                  )}
                </button>
              </div>
            ))
        )}
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
    setShowOverlay(false); // Close overlay
    window.location.reload(); // Reload because modifications occurred
  }, []);

  const handleOpenOverlay = () => {
    setShowOverlay(true); // Open overlay
  };

  return (
    <>
      <button
        type="button"
        className={`add-to-basket-from-summary ${styles.textButton}`}
        onClick={handleOpenOverlay}
      >
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
