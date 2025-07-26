'use client';

import type { ProductWithMerchant } from 'lib/types';
import React, {
  createContext,
  use,
  useContext,
  useMemo,
  useOptimistic
} from 'react';

export type CartItem = {
  id: string;
  product: ProductWithMerchant;
  quantity: number;
  price: number;
};

export type Cart = {
  id?: string;
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
};

type UpdateType = 'plus' | 'minus' | 'delete';

type CartAction =
  | {
      type: 'UPDATE_ITEM';
      payload: { productId: string; updateType: UpdateType };
    }
  | {
      type: 'ADD_ITEM';
      payload: { product: ProductWithMerchant };
    };

type CartContextType = {
  cartPromise: Promise<Cart | undefined>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function updateCartItem(
  item: CartItem,
  updateType: UpdateType
): CartItem | null {
  if (updateType === 'delete') return null;

  const newQuantity =
    updateType === 'plus' ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  return {
    ...item,
    quantity: newQuantity
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  product: ProductWithMerchant
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;

  return {
    id: existingItem?.id || `${product.id}-${Date.now()}`,
    product,
    quantity,
    price: product.price
  };
}

function updateCartTotals(items: CartItem[]): Pick<Cart, 'totalQuantity' | 'totalAmount'> {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  return {
    totalQuantity,
    totalAmount
  };
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    items: [],
    totalQuantity: 0,
    totalAmount: 0
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case 'UPDATE_ITEM': {
      const { productId, updateType } = action.payload;
      const updatedItems = currentCart.items
        .map((item) =>
          item.product.id === productId
            ? updateCartItem(item, updateType)
            : item
        )
        .filter(Boolean) as CartItem[];

      if (updatedItems.length === 0) {
        return {
          ...currentCart,
          items: [],
          totalQuantity: 0,
          totalAmount: 0
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedItems),
        items: updatedItems
      };
    }
    case 'ADD_ITEM': {
      const { product } = action.payload;
      const existingItem = currentCart.items.find(
        (item) => item.product.id === product.id
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        product
      );

      const updatedItems = existingItem
        ? currentCart.items.map((item) =>
            item.product.id === product.id ? updatedItem : item
          )
        : [...currentCart.items, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedItems),
        items: updatedItems
      };
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  return (
    <CartContext.Provider value={{ cartPromise }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const initialCart = use(context.cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer
  );

  const updateCartItem = (productId: string, updateType: UpdateType) => {
    updateOptimisticCart({
      type: 'UPDATE_ITEM',
      payload: { productId, updateType }
    });
  };

  const addCartItem = (product: ProductWithMerchant) => {
    updateOptimisticCart({ type: 'ADD_ITEM', payload: { product } });
  };

  return useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem
    }),
    [optimisticCart]
  );
}
