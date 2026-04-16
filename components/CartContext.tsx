'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
    id: number;
    title: string;
    price: string;
    image: string;
    quantity: number;
}

export interface DeliveryInfo {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    feeId: number | null;
    deliveryFee: number;
}

interface CartContextProps {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    deliveryInfo: DeliveryInfo;
    updateDeliveryInfo: (info: Partial<DeliveryInfo>) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = (): CartContextProps => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

const INITIAL_DELIVERY: DeliveryInfo = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    feeId: null,
    deliveryFee: 0,
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>(INITIAL_DELIVERY);

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const clearCart = () => {
        setItems([]);
        setDeliveryInfo(INITIAL_DELIVERY);
    };

    const updateDeliveryInfo = (info: Partial<DeliveryInfo>) => {
        setDeliveryInfo(prev => ({ ...prev, ...info }));
    };

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            clearCart,
            isDrawerOpen,
            openDrawer,
            closeDrawer,
            deliveryInfo,
            updateDeliveryInfo
        }}>
            {children}
        </CartContext.Provider>
    );
};
