"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext({
  wishlistIds: [],
  isInWishlist: () => false,
  toggle: () => {},
});

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("wishlist-ids") : null;
    if (saved) setWishlistIds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wishlist-ids", JSON.stringify(wishlistIds));
    }
  }, [wishlistIds]);

  const api = useMemo(() => ({
    wishlistIds,
    isInWishlist: (id) => wishlistIds.includes(id),
    toggle: (id) => {
      setWishlistIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    },
  }), [wishlistIds]);

  return <WishlistContext.Provider value={api}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  return useContext(WishlistContext);
}



