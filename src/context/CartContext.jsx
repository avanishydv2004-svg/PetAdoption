import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, itemType = "pet") => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id && p.itemType === itemType);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id && p.itemType === itemType && p.quantity < p.stock
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...item, quantity: 1, itemType }];
    });
  };

  const removeFromCart = (id, itemType = "pet") => {
    setCart((prev) => prev.filter((p) => !(p.id === id && p.itemType === itemType)));
  };

  const increaseQty = (id, itemType = "pet") => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id && p.itemType === itemType && p.quantity < p.stock
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
    );
  };

  const decreaseQty = (id, itemType = "pet") => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id && p.itemType === itemType && p.quantity > 1
          ? { ...p, quantity: p.quantity - 1 }
          : p
      )
    );
  };

  const clearCart = () => setCart([]);

  const clearCartByType = (itemType) => {
    setCart((prev) => prev.filter((p) => p.itemType !== itemType));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart, clearCartByType }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);