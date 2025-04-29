import React, { useState } from "react";
import AddToBasketComponent from "./AddToBasketComponent";

interface AddCourseToBasketProps {
  offerId: string;
  displayprice: string;
}

const CourseDetailsAddToBasket: React.FC<AddCourseToBasketProps> = ({
  displayprice,
  offerId,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
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
  );
};

export default CourseDetailsAddToBasket;
