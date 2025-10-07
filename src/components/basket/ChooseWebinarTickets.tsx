import React, { useState, useCallback, useEffect } from "react";
import styles from "../../styles/components/cart/overlay.module.css";
import cartStyles from "../../styles/components/cart/cart.module.css";
import type { WebinarTicket, Webinar } from "../../types/webinar";
import type { BasketItem } from "../../types/basket-item.ts";
import {useStore} from "@nanostores/react";
import {addItem, isInBasket} from "../../scripts/basket/basket.ts";
import { DiscountedPrice } from "./DiscountedPrice.tsx";
import { clientFetchItemFromAPI } from "../../scripts/basket/getCourseOrWebinarFromAPI.ts";

interface TicketSelectionOverlayProps {
  webinar: Webinar;
  onCloseWithoutModification: () => void; // Close without modifications
}

const TicketSelectionOverlay: React.FC<TicketSelectionOverlayProps> = ({
  webinar,
  onCloseWithoutModification,
}) => {
  const [hasModified, setHasModified] = useState(false); // Local flag for modifications
  const [loading, setLoading] = useState<string | null>(null); // Keeps track of loading ticket ID
  const [isAnyButtonLoading, setIsAnyButtonLoading] = useState(false);
  const getId = (ticket: WebinarTicket) => `${webinar.id}_${ticket.id}`;

  const handleAddToBasket = async (ticket: WebinarTicket) => {
    const id = getId(ticket);
    if (!isInBasket(id)) {
      setLoading(id);
      setIsAnyButtonLoading(true); // Set global loading state

      // Fetch ticket details and add to basket
      try {
        const basketItem = await clientFetchItemFromAPI(id, "webinar");
        if(basketItem) {
          addItem(basketItem);
        }
        else{
          console.error("Error adding ticket to basket - could not fetch ticket details from API for id", id);
        }
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

  const ticketsInCart = webinar.tickets.map((ticket) => isInBasket(getId(ticket)));
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

        {hasTicketInCart ? (
          <>
            <h3>ADDED TO BASKET</h3>
            <p>{webinar.title}</p>
            <div className={styles.buttonGroup}>
              <button
                className={styles.continueButton}
                onClick={handleClose}
              >
                Continue Shopping
              </button>
              <button
                className={cartStyles.checkoutButton}
                onClick={() => (window.location.href = "/checkout")}
              >
                Checkout
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>{webinar.title}</h3>
            {webinar
              .tickets!.filter((ticket) => !ticket.hidden)
              .map((ticket) => (
                <div className={styles.ticketRow} key={ticket.id}>
                  <span className={styles.ticketName}>{ticket.name}</span>
                  <span className={styles.ticketCost}>  <DiscountedPrice
                    offerId={webinar.id}
                    priceInPence={ticket.costValue ? ticket.costValue : 0}
                  /></span>
                  <button
                    type="button"
                    className={styles.addToBasket}
                    onClick={() => handleAddToBasket(ticket)}
                    disabled={isAnyButtonLoading}
                  >
                    {loading === getId(ticket) ? (
                      <span className={styles.spinner} />
                    ) : (
                      "Add to Basket"
                    )}
                  </button>
                </div>
              ))}
          </>
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
  const [isClient, setIsClient] = useState(false);

  const handleCloseWithoutModification = useCallback(() => {
    setShowOverlay(false); // Close overlay
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Don't render anything on the server
  }


  const hasTicketInCart = webinar.tickets.some((ticket) =>
    isInBasket(`${webinar.id}_${ticket.id}`)
  );

  return (
    <>
      <button
        type="button"
        role="button"
        className={`add-to-basket-from-summary ${styles.textButton}`}
        onClick={() => hasTicketInCart ? window.location.href = "/basket" : setShowOverlay(true)}
        onTouchStart={(e) => e.currentTarget.classList.add('active')}
        onTouchEnd={(e) => e.currentTarget.classList.remove('active')}
      >
        {hasTicketInCart ? <span>In Basket</span> : <span>Select Tickets</span>
        }
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
