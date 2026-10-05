"use client";

import React, { createContext, useContext, useState } from "react";
import {
  generatePurchaseMessage,
  generateCartPurchaseMessage,
  SingleProductPurchaseInfo,
  CartPurchaseItem,
} from "@/lib/messenger/purchase";

export interface PurchaseItemPayload {
  productId?: string;
  price: number;
  quantity: number;
}

interface PurchaseContextType {
  isOpen: boolean;
  message: string;
  purchaseItems: PurchaseItemPayload[];
  openSinglePurchase: (
    product: SingleProductPurchaseInfo,
    quantity?: number,
    variant?: string | null
  ) => void;
  openCartPurchase: (items: CartPurchaseItem[]) => void;
  closePurchaseModal: () => void;
}

const PurchaseModalContext = createContext<PurchaseContextType | undefined>(undefined);

export function PurchaseModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItemPayload[]>([]);

  const openSinglePurchase = (
    product: SingleProductPurchaseInfo,
    quantity: number = 1,
    variant?: string | null
  ) => {
    const msg = generatePurchaseMessage(product, quantity, variant);
    setMessage(msg);
    setPurchaseItems([
      {
        productId: product.id,
        price: product.price,
        quantity,
      },
    ]);
    setIsOpen(true);
  };

  const openCartPurchase = (items: CartPurchaseItem[]) => {
    const msg = generateCartPurchaseMessage(items);
    setMessage(msg);
    setPurchaseItems(
      items.map((it) => ({
        productId: it.productId,
        price: it.price,
        quantity: it.quantity,
      }))
    );
    setIsOpen(true);
  };

  const closePurchaseModal = () => {
    setIsOpen(false);
    setMessage("");
    setPurchaseItems([]);
  };

  return (
    <PurchaseModalContext.Provider
      value={{
        isOpen,
        message,
        purchaseItems,
        openSinglePurchase,
        openCartPurchase,
        closePurchaseModal,
      }}
    >
      {children}
    </PurchaseModalContext.Provider>
  );
}

export function usePurchaseModal() {
  const context = useContext(PurchaseModalContext);
  if (!context) {
    throw new Error("usePurchaseModal must be used within a PurchaseModalProvider");
  }
  return context;
}
