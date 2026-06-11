'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export type BillingCycle = 'monthly' | 'yearly' | '3month';
export type Mode = 'payment' | 'subscription';

export interface CartProductBase {
  id: string;
  billingCycle?: BillingCycle;
  stripePriceId: string;
  price: string;
  title?: string;
  imageUrl?: string;
  mode: Mode;
}

export interface CartProduct extends CartProductBase {
  quantity: number;
}

interface CartContextType {
  cartProducts: CartProduct[];
  addProduct: (product: CartProductBase) => void;
  removeProduct: (id: string, billingCycle?: BillingCycle) => void;
  switchSubscriptionCycle: (
    id: string,
    fromCycle: BillingCycle,
    toProduct: CartProductBase
  ) => void;
  updateCartItemsFromEnriched: (enrichedProducts: any[]) => void;
  clearCart: () => void;
  hydrated: boolean;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      if (stored) {
        try {
          setCartProducts(JSON.parse(stored));
        } catch (e) {
          // Invalid cart data
        }
      }
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('cart', JSON.stringify(cartProducts));
    }
  }, [cartProducts, hydrated]);

  const addProduct = (product: CartProductBase) => {
    setCartProducts((prev) => {
      // SEO and GBP plans cannot duplicate - always quantity 1
      const isSEOOrGBP =
        product.id?.startsWith('seo-') ||
        product.id?.startsWith('gbp-') ||
        product.id?.startsWith('geo-');
      
      const existing = prev.find(
        (p) =>
          p.id === product.id &&
          p.billingCycle === product.billingCycle &&
          p.mode === product.mode
      );
      
      if (existing) {
        // For SEO/GBP, don't increase quantity - they're unique
        if (isSEOOrGBP) {
          return prev; // Already exists, don't add duplicate
        }
        return prev.map((p) =>
          p.id === product.id &&
          p.billingCycle === product.billingCycle &&
          p.mode === product.mode
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeProduct = (id: string, billingCycle?: BillingCycle) => {
    setCartProducts((prev) => {
      const found = prev.find(
        (p) => p.id === id && p.billingCycle === billingCycle
      );
      if (!found) return prev;
      
      // SEO and GBP plans: remove completely (quantity always 1, no decrement)
      const isSEOOrGBP =
        id?.startsWith('seo-') ||
        id?.startsWith('gbp-') ||
        id?.startsWith('geo-');
      if (isSEOOrGBP) {
        return prev.filter(
          (p) => !(p.id === id && p.billingCycle === billingCycle)
        );
      }
      
      if (found.quantity === 1) {
        return prev.filter(
          (p) => !(p.id === id && p.billingCycle === billingCycle)
        );
      }
      return prev.map((p) =>
        p.id === id && p.billingCycle === billingCycle
          ? { ...p, quantity: p.quantity - 1 }
          : p
      );
    });
  };

  /**
   * Move an existing subscription item from one billing cycle to another
   * without creating transient duplicates in cart state.
   * Preserves the original position of the product in the cart.
   */
  const switchSubscriptionCycle = (
    id: string,
    fromCycle: BillingCycle,
    toProduct: CartProductBase
  ) => {
    setCartProducts((prev) => {
      // Find the source item and its index to preserve position
      const sourceIndex = prev.findIndex(
        (p) =>
          p.id === id &&
          p.mode === 'subscription' &&
          p.billingCycle === fromCycle
      );
      
      if (sourceIndex === -1) return prev;
      
      const source = prev[sourceIndex];
      if (!source) return prev;

      // SEO/GBP always quantity 1, others preserve quantity
      const isSEOOrGBP =
        id?.startsWith('seo-') ||
        id?.startsWith('gbp-') ||
        id?.startsWith('geo-');
      const qtyToMove = isSEOOrGBP ? 1 : (source.quantity > 0 ? source.quantity : 1);

      // Check if target item already exists (different billing cycle of same product)
      const targetIndex = prev.findIndex(
        (p) =>
          p.id === toProduct.id &&
          p.mode === toProduct.mode &&
          p.billingCycle === toProduct.billingCycle &&
          p.billingCycle !== fromCycle // Make sure it's different from source
      );

      if (targetIndex >= 0) {
        // Target exists: merge/replace at target position, remove source
        const updated = [...prev];
        if (isSEOOrGBP) {
          // For SEO/GBP, replace target with new product
          updated[targetIndex] = { ...toProduct, quantity: 1 };
        } else {
          // For others, merge quantities
          updated[targetIndex] = { ...updated[targetIndex], quantity: updated[targetIndex].quantity + qtyToMove };
        }
        // Remove source item (if different from target)
        if (sourceIndex !== targetIndex) {
          updated.splice(sourceIndex, 1);
        }
        return updated;
      }

      // Target doesn't exist: replace source at same position
      const updated = [...prev];
      updated[sourceIndex] = { ...toProduct, quantity: qtyToMove };
      return updated;
    });
  };

  const updateCartItemsFromEnriched = (enrichedProducts: any[]) => {
    setCartProducts((prev) => {
      let hasChanges = false;
      const updated = prev.map((cartItem) => {
        // Find matching enriched product
        const enriched = enrichedProducts.find(
          (ep) =>
            ep.id === cartItem.id &&
            ep.billingCycle === cartItem.billingCycle &&
            ep.mode === cartItem.mode
        );
        
        if (enriched) {
          // Update stripePriceId and price from enriched product
          // Determine which stripePriceId to use based on billing cycle and mode
          let newStripePriceId = cartItem.stripePriceId;
          if (cartItem.mode === 'payment') {
            newStripePriceId = enriched.stripeOneTimePriceId || cartItem.stripePriceId;
          } else if (cartItem.billingCycle === 'yearly') {
            newStripePriceId = enriched.stripePriceYearlyId || cartItem.stripePriceId;
          } else if (cartItem.billingCycle === '3month') {
            newStripePriceId = enriched.stripePrice3MonthId || cartItem.stripePriceId;
          } else {
            // monthly or undefined
            newStripePriceId = enriched.stripePriceMonthlyId || cartItem.stripePriceId;
          }
          
          const newPrice = enriched.price || cartItem.price;
          
          // Only update if something actually changed
          if (newStripePriceId !== cartItem.stripePriceId || newPrice !== cartItem.price) {
            hasChanges = true;
            return {
              ...cartItem,
              stripePriceId: newStripePriceId,
              price: newPrice,
            };
          }
        }
        
        return cartItem;
      });
      
      // Only return new array if there were actual changes
      return hasChanges ? updated : prev;
    });
  };

  const clearCart = () => setCartProducts([]);

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        addProduct,
        removeProduct,
        switchSubscriptionCycle,
        updateCartItemsFromEnriched,
        clearCart,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
