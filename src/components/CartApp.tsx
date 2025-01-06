import React from "react";
import { CartProvider, useCart } from "react-use-cart";

export interface Product {
  id: string;
  name: string;
  price: number;
}

const Page: React.FC = () => {
  const { addItem, inCart, setCartMetadata, items } = useCart();

  const products: Product[] = [
    {
      id: "price_1Qc47iReZarnNjSd5z0YEPBJ",
      name: "Helping Me With Things",
      price: 4000,
    },
    {
      id: "price_1QeG0iReZarnNjSd7QT3M2zJ",
      name: "A little something else",
      price: 4000,
    },
    {
      id: "3",
      name: "Kullen",
      price: 4500,
    },
  ];

  return (
    <div>
      {products.map((p) => {
        const alreadyAdded = inCart(p.id);

        return (
          <div key={p.id}>
            {p.name}
            {!alreadyAdded && (
              <button onClick={() => addItem(p)}>Add to Basket</button>
            )}
          </div>
        );
      })}
      {/*<button onClick={() => setCartMetadata({ hello: "world" })}>*/}
      {/*  Set metadata*/}
      {/*</button>*/}
    </div>
  );
};

const Cart: React.FC = () => {
  const {
    isEmpty,
    cartTotal,
    totalUniqueItems,
    items,
    updateItemQuantity,
    removeItem,
    emptyCart,
    metadata,
  } = useCart();

  const handleCheckout = () => {
    // Redirect to checkout page
    if (items.length === 0) return alert("No items in basket");
    window.location.href = "/checkout";
  };

  if (isEmpty) return <p>Your cart is empty</p>;

  const formattedPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(cartTotal / 100); // Divide by 100 if cartTotal is in cents/pennies

  return (
    <>
      <h1>Basket</h1>
      Total: {formattedPrice}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}&nbsp;
            {/*<button*/}
            {/*  onClick={() =>*/}
            {/*    updateItemQuantity(item.id, (item.quantity ?? 0) - 1)*/}
            {/*  }*/}
            {/*>*/}
            {/*  -*/}
            {/*</button>*/}
            {/*<button*/}
            {/*  onClick={() =>*/}
            {/*    updateItemQuantity(item.id, (item.quantity ?? 0) + 1)*/}
            {/*  }*/}
            {/*>*/}
            {/*  +*/}
            {/*</button>*/}
            <button onClick={() => removeItem(item.id)}>Remove &times;</button>
          </li>
        ))}
      </ul>
      <button onClick={handleCheckout}>Checkout</button>
      {!isEmpty && <button onClick={emptyCart}>Empty cart</button>}
      {/*<pre>Metadata: {JSON.stringify(metadata, null, 2)}</pre>*/}
    </>
  );
};

const CartApp: React.FC = () => {
  return (
    <CartProvider
      id="website"
      onItemAdd={(item) => console.log(`Item ${item.id} added!`)}
      onItemUpdate={(item) => console.log(`Item ${item.id} updated.!`)}
      onItemRemove={() => console.log(`Item removed!`)}
    >
      <Cart />
      <Page />
    </CartProvider>
  );
};

export default CartApp;
