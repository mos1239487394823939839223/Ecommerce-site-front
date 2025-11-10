"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/components/CartProvider";
import { WishlistProvider } from "@/components/WishlistProvider";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}



