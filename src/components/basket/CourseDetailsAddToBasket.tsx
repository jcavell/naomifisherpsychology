import React, { useEffect, useState } from "react";
import AddToBasketComponent from "./AddToBasketComponent";
import {
  getCouponCodeFromRequestOrLS,
  getDiscountedDisplayPrice,
} from "../../scripts/coupon/couponApplier.ts";
import { DiscountedPrice } from "./DiscountedPrice.tsx";

interface AddCourseToBasketProps {
  offerId: string;
  priceInPence: number;
}

const CourseDetailsAddToBasket: React.FC<AddCourseToBasketProps> = ({
  priceInPence,
  offerId,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="purchase">
      <div className="price">
        <DiscountedPrice offerId={offerId} priceInPence={priceInPence} />
      </div>
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
