import React, {useEffect, useState} from "react";
import {useStore} from '@nanostores/react';
import {getItemCount} from '../../scripts/basket/basket.ts';
import styles from "../../styles/components/cart/basketIcon.module.css";

const BasketIcon: React.FC = () => {
    const $count = useStore(getItemCount);

    const [clientTotalItems, setClientTotalItems] = useState(0);

    useEffect(() => {
        setClientTotalItems($count);
    }, [$count]);

    return (
        <a href="/basket" className={`basket-button ${styles.basketWrapper}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {clientTotalItems > 0 && (
                <span className={styles.basketCount}>
          {clientTotalItems}
        </span>
            )}
        </a>
    );
};

export default BasketIcon;