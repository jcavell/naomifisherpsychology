import React, { useState } from "react";
import "./overlay.css"; // Overlay styles
import AddToBasketComponent from "./AddToBasketComponent";
import { useCart } from "react-use-cart";
import type { Ticket } from "../types/webinar";

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
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="overlay-content">
        <h2>Select a Ticket</h2>
        <form>
          {ticketClasses.map((ticket) => (
            <div key={ticket.id}>
              <label>
                <input
                  type="radio"
                  name="ticket"
                  value={ticket.id}
                  onChange={() => setSelectedTicketId(ticket.id)}
                />
                {ticket.display_name} - {ticket.cost?.display ?? "Free"}
              </label>
            </div>
          ))}
        </form>
        {selectedTicketId && (
          <AddToBasketComponent
            id={`${webinarId}_${selectedTicketId}`} // Unique ID for ticket
            type="webinar"
          />
        )}
        <button disabled={!selectedTicketId} onClick={onClose}>
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
          onClose={() => setShowOverlay(false)}
        />
      )}
    </>
  );
};

export default TicketSelectorButton;
