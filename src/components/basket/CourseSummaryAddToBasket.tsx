import React, { useState } from "react";
import AddToBasketComponent from "./AddToBasketComponent";

interface AddCourseSummaryToBasketProps {
  offerId: string;
}

const AddCourseSummaryToBasket: React.FC<AddCourseSummaryToBasketProps> = ({
  offerId,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
      <AddToBasketComponent
        id={offerId}
        type="course"
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        buttonType="summary"
      />
  );
};

export default AddCourseSummaryToBasket;
