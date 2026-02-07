import React, { createContext, useContext, useState } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number; 
  imageUri: string;
  qty: number;
};

type OrderType = 'dine-in' | 'take-away';

// Tambahkan "pending" ke dalam daftar status
type OrderStatus = 'pending' | 'paid' | 'checked-in' | 'completed';

type OrderContextType = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>; 
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, qty: number) => void;
  checkoutOrder: () => void;
  setOrderType: (type: OrderType) => void;
  orderType: OrderType;
  tableNumber: string | null;
  setTableNumber: (num: string | null) => void;
  orderStatus: OrderStatus;
  setOrderStatus: (status: OrderStatus) => void;
  resetOrder: () => void; 
};

const OrderContext = createContext<OrderContextType>({} as any);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');

  const addToCart = (item: any) => {
    const priceNumber = typeof item.price === 'string' 
      ? parseInt(item.price.replace(/\./g, "").replace("Rp", "")) 
      : item.price;
    
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + (item.quantity || 1) } : i);
      }
      return [...prev, { ...item, price: priceNumber, qty: item.quantity || 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );
  };

  const checkoutOrder = () => {
    // Dipanggil saat masuk ke proses checkout
    setOrderStatus('pending');
  };

  const resetOrder = () => {
    setCart([]);
    setTableNumber(null);
    setOrderStatus('pending');
  };

  return (
    <OrderContext.Provider 
      value={{ 
        cart, 
        setCart,
        addToCart, 
        removeFromCart, 
        updateCartQty,  
        checkoutOrder, 
        setOrderType, 
        orderType, 
        tableNumber, 
        setTableNumber, 
        orderStatus, 
        setOrderStatus,
        resetOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);