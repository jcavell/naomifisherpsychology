import React from "react";
import { CartProvider } from "react-use-cart";
import ChooseWebinarTickets from "./ChooseWebinarTickets.tsx";
import type { Ticket, Webinar } from "../../types/webinar";

// Define props for the wrapper
interface ChooseWebinarTicketsWrapperProps {
  webinar: Webinar;
}

// Wrapper component
const ChooseWebinarTicketsWrapper: React.FC<
  ChooseWebinarTicketsWrapperProps
> = ({ webinar }) => {
  return (
    <CartProvider id="website">
      <ChooseWebinarTickets webinar={webinar} />
    </CartProvider>
  );
};

export default ChooseWebinarTicketsWrapper;
