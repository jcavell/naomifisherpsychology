import React, { useState, useEffect, useCallback } from "react";
import styles from "../../styles/components/cart/overlay.module.css";
import cartStyles from "../../styles/components/cart/cart.module.css";
import { useCart } from "react-use-cart";
import type { WebinarTicket, Webinar } from "../../types/webinar";
import type { BasketItem } from "../../types/basket-item";

interface TicketSelectionOverlayProps {
  webinar: Webinar;
  onCloseWithoutModification: () => void; // Close without modifications
}

const TicketSelectionOverlay: React.FC<TicketSelectionOverlayProps> = ({
  webinar,
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

  const handleClose = () => {
    onCloseWithoutModification();
  };

  const ticketsInCart = webinar.tickets.map((ticket) => inCart(getId(ticket)));
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
        <div
          className={styles.closeOverlayButton}
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        >
          &times;
        </div>

        <div className={styles.overlayTitle}>
          <p>{webinar.title}</p>
        </div>

        {hasTicketInCart ? (
          <div>
            <p className={styles.inBasketMessage}>Added to your basket.</p>
            <button
              className={cartStyles.checkoutButton}
              onClick={() => (window.location.href = "/checkout")}
            >
              Checkout
            </button>
          </div>
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
  const { inCart } = useCart();

  const handleCloseWithoutModification = useCallback(() => {
    setShowOverlay(false); // Close overlay
  }, []);


  const hasTicketInCart = webinar.tickets.some((ticket) =>
    inCart(`${webinar.id}_${ticket.id}`)
  );

  return (
    <>
      <button
        type="button"
        className={`add-to-basket-from-summary ${styles.textButton}`}
        onClick={() => hasTicketInCart ? window.location.href = "/basket" : setShowOverlay(true)}
      >
        {hasTicketInCart ? <span>In Basket</span> : "Select Tickets"}
      </button>
      {showOverlay && (
        <TicketSelectionOverlay
          webinar={webinar}
          onCloseWithoutModification={handleCloseWithoutModification}
        />
      )}
    </>
  );
};

export default TicketSelectorButton;
