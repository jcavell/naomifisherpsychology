import React from "react";
import { CartProvider } from "react-use-cart";
import ChooseWebinarTickets from "./ChooseWebinarTickets";
import type { Ticket } from "../types/webinar";

// Define props for the wrapper
interface ChooseWebinarTicketsWrapperProps {
  ticketClasses: Ticket[];
  webinarId: string;
}

// Wrapper component
const ChooseWebinarTicketsWrapper: React.FC<
  ChooseWebinarTicketsWrapperProps
> = ({ ticketClasses, webinarId }) => {
  return (
    <CartProvider id="website">
      <ChooseWebinarTickets
        ticketClasses={ticketClasses}
        webinarId={webinarId}
      />
    </CartProvider>
  );
};

export default ChooseWebinarTicketsWrapper;
