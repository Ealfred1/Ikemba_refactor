'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const storedItems = localStorage.getItem('lekki-mart-cart');
        const storedInfo = localStorage.getItem('lekki-mart-delivery');

        if (storedItems) {
            try {
                setItems(JSON.parse(storedItems));
            } catch (e) {
                console.error('Error parsing cart items', e);
            }
        }

        if (storedInfo) {
            try {
                setDeliveryInfo(JSON.parse(storedInfo));
            } catch (e) {
                console.error('Error parsing delivery info', e);
            }
        }
        
        setIsInitialized(true);
    }, []);

    // Persist to localStorage whenever state changes
    useEffect(() => {
        if (!isInitialized) return;
        
        localStorage.setItem('lekki-mart-cart', JSON.stringify(items));
        localStorage.setItem('lekki-mart-delivery', JSON.stringify(deliveryInfo));

        // Sync a small cookie for server-side visibility if needed
        const count = items.reduce((acc, item) => acc + item.quantity, 0);
        document.cookie = `cart_count=${count}; path=/; max-age=31536000; SameSite=Strict`;
    }, [items, deliveryInfo, isInitialized]);

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
        localStorage.removeItem('lekki-mart-cart');
        localStorage.removeItem('lekki-mart-delivery');
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
