import React, { useState } from "react";
import { CartProvider } from "react-use-cart";
import AddToBasketComponent from "./AddToBasketComponent";

interface AddCourseToBasketProps {
  offerId: string;
  displayprice: string;
}

const AddCourseToBasket: React.FC<AddCourseToBasketProps> = ({
  displayprice,
  offerId,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <CartProvider id="website">
      <div className="purchase">
        <div className="price">{displayprice}</div>
        <div className="company">RECORDED COURSE</div>
        <AddToBasketComponent
          id={offerId}
          type="course"
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </div>
    </CartProvider>
  );
};

export default AddCourseToBasket;
