import { createContext, useState, useContext, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isWishlisted = (id, itemType) =>
    wishlist.some((item) => item.id === id && item.itemType === itemType);

  const toggleWishlist = (item, itemType) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === item.id && w.itemType === itemType);
      if (exists) {
        return prev.filter((w) => !(w.id === item.id && w.itemType === itemType));
      }
      return [...prev, { ...item, itemType }];
    });
  };

  const removeFromWishlist = (id, itemType) => {
    setWishlist((prev) => prev.filter((w) => !(w.id === id && w.itemType === itemType)));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, isWishlisted, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);