import React, {useState} from "react";
import {useStore} from "@nanostores/react";
import {addItem, removeItem, getBasketItem} from "../../scripts/basket/basket.ts";
import overlayStyles from "../../styles/components/cart/overlay.module.css";
import cartStyles from "../../styles/components/cart/cart.module.css";
import type {BasketItem} from "../../types/basket-item";
import {useClientOnly} from "../../scripts/basket/use-client-only-hook.ts";

export type BasketItemType = "webinar" | "course";

export interface AddToBasketProps {
    id: string;
    type: BasketItemType;
    isProcessing: boolean;
    setIsProcessing: (value: boolean) => void;
    buttonType?: "summary" | "detail";
}

const fetchItem = async (
    id: string,
    type: BasketItemType,
): Promise<BasketItem | undefined> => {
    try {
        const endpoint =
            type === "course" ? `/api/courses/${id}` : `/api/webinar-tickets/${id}`;

        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Error fetching item:", err);
    }
};

const Button: React.FC<AddToBasketProps> = ({
                                          id,
                                          type,
                                          isProcessing,
                                          setIsProcessing,
                                          buttonType,
                                      }) => {

    const isClient = useClientOnly(); // Hook to check client-side
    const $basketItem = useStore(getBasketItem(id));

    const [buttonText, setButtonText] = useState("Add to Basket");
    const [showOverlay, setShowOverlay] = useState(false); // Tracks overlay visibility

    if (!isClient) {
        // Return minimal SSR-compatible markup
        return (
            <button className={overlayStyles.addToBasket}>
                Loading...
            </button>
        );
    }

    const handleAddToBasket = async () => {
        setIsProcessing(true);
        setButtonText("Adding item to basket.");

        if (!$basketItem) {
            try {
                const basketItem = await fetchItem(id, type);
                if (basketItem !== undefined) {
                    addItem(basketItem);
                }
                setShowOverlay(true);
            } finally {
                setIsProcessing(false);
                setButtonText("Add to Basket");
            }
        } else {
            setIsProcessing(false);
        }
    };

    const handleRemoveFromBasket = () => {
        removeItem(id);
        setButtonText("Add to Basket");
        setIsProcessing(false);
    };

    const closeOverlay = () => {
        setShowOverlay(false);
    };

    return (
        <>
            {$basketItem ? (
                <button
                    className={
                        buttonType === "detail"
                            ? `${overlayStyles.addToBasket} ${overlayStyles.inBasket}`
                            : `add-to-basket-from-summary ${overlayStyles.textButton}`
                    }
                    onClick={(event) => {
                        event.preventDefault();
                        window.location.href = "/basket";
                    }}
                >
                    <span>In Basket</span>
                </button>
            ) : (
                <button
                    className={
                        buttonType === "detail"
                            ? overlayStyles.addToBasket
                            : `add-to-basket-from-summary ${overlayStyles.textButton}`
                    }
                    disabled={isProcessing}
                    onClick={(event) => {
                        event.preventDefault();
                        handleAddToBasket();
                    }}
                >
                    {buttonText}
                </button>
            )}

            {showOverlay && (
                <div
                    className={overlayStyles.overlay}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeOverlay(); // Invoked when clicking outside overlay-content
                        }
                    }}
                >
                    <div className={overlayStyles.overlayContent}>
                        <div
                            className={overlayStyles.closeOverlayButton}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the overlay click handler
                                closeOverlay();
                            }}
                        >
                            &times;
                        </div>
                        <h3>ADDED TO BASKET</h3>
                        <p>
                            {$basketItem?.product_name}
                        </p>
                        <div className={overlayStyles.buttonGroup}>
                            <button
                                className={overlayStyles.continueButton}
                                onClick={closeOverlay}
                            >
                                Continue Shopping
                            </button>
                            <button
                                className={cartStyles.checkoutButton}
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        window.location.href = "/checkout";
                                    }
                                }}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const AddToBasketComponent: React.FC<AddToBasketProps> = ({
                                                        id,
                                                        type,
                                                        isProcessing,
                                                        setIsProcessing,
                                                        buttonType = "detail"
                                                    }) => {
    return (
        <Button
            id={id}
            type={type}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            buttonType={buttonType}
        />
    );
};

export default AddToBasketComponent;
