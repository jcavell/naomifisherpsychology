import React, {useState} from "react";
import type {BasketItem} from "../../types/basket-item";
import {useClientOnly} from "../../scripts/basket/use-client-only-hook.ts";
import overlayStyles from "../../styles/components/cart/overlay.module.css";

export interface RequestRefundProps {orderId: string, basketItem: BasketItem}

const RequestRefundButton: React.FC<RequestRefundProps> = ({orderId, basketItem}) => {
    const isClient = useClientOnly(); // Hook to check client-side

    const [buttonText, setButtonText] = useState("Request Refund");
    const [showOverlay, setShowOverlay] = useState(false); // Tracks overlay visibility

    if (!isClient) {
        // Return minimal SSR-compatible markup
        return (
            <button className={overlayStyles.addToBasket}>
                Loading...
            </button>
        );
    }

    const closeOverlay = () => {
        setShowOverlay(false);
    };


    return<></>
}