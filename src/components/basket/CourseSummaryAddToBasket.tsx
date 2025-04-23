import React, { useState } from "react";
import { CartProvider } from "react-use-cart";
import AddToBasketComponent from "./AddToBasketComponent";

interface AddCourseSummaryToBasketProps {
  offerId: string;
}

const AddCourseSummaryToBasket: React.FC<AddCourseSummaryToBasketProps> = ({
  offerId,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <CartProvider id="website">
      <AddToBasketComponent
        id={offerId}
        type="course"
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        buttonType="summary"
      />
    </CartProvider>
  );
};

export default AddCourseSummaryToBasket;
