
import React, { createContext, useContext, useState } from 'react';

type CartItem = {
  id: string; // pakai name sebagai ID sederhana
  name: string;
  price: number; // ubah string "24.000" jadi number 24000 biar gampang dihitung
  imageUri: string;
  qty: number;
};

type OrderType = 'dine-in' | 'take-away';

type OrderContextType = {
  cart: CartItem[];
  addToCart: (item: any) => void;
  checkoutOrder: () => void;
  setOrderType: (type: OrderType) => void;
  orderType: OrderType;
  tableNumber: string | null;
  setTableNumber: (num: string) => void;
  orderStatus: 'paid' | 'checked-in' | 'completed';
  setOrderStatus: (status: 'paid' | 'checked-in' | 'completed') => void;
};

const OrderContext = createContext<OrderContextType>({} as any);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<'paid' | 'checked-in' | 'completed'>('paid');

  const addToCart = (item: any) => {
    // Logic sederhana: hapus "Rp" dan titik, ubah ke number
    const priceNumber = parseInt(item.price.replace(/\./g, "").replace("Rp", ""));
    
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) => i.name === item.name ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, id: item.name, price: priceNumber, qty: 1 }];
    });
  };

  const checkoutOrder = () => {
    // Reset status saat checkout baru
    setOrderStatus('paid');
  };

  return (
    <OrderContext.Provider value={{ cart, addToCart, checkoutOrder, orderType, setOrderType, tableNumber, setTableNumber, orderStatus, setOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);