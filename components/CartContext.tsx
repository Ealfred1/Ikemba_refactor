'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItem {
    id: number;
    title: string;
    price: number;
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

function sanitizeCartItem(item: unknown): CartItem | null {
    if (!item || typeof item !== 'object') return null;
    const raw = item as Record<string, unknown>;
    if (!raw.id || !raw.title || raw.price == null || !raw.image) return null;

    const price = typeof raw.price === 'string'
        ? parseFloat(raw.price.replace(/[^0-9.]/g, ''))
        : Number(raw.price);

    return {
        id: Number(raw.id),
        title: String(raw.title),
        price: isNaN(price) ? 0 : price,
        image: String(raw.image),
        quantity: Number(raw.quantity) || 1,
    };
}

function loadStoredItems(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem('lekki-mart-cart');
        if (!stored) return [];
        const parsed = JSON.parse(stored) as unknown[];
        return parsed.map(sanitizeCartItem).filter(Boolean) as CartItem[];
    } catch {
        return [];
    }
}

function loadStoredDelivery(): DeliveryInfo {
    if (typeof window === 'undefined') return INITIAL_DELIVERY;
    try {
        const stored = localStorage.getItem('lekki-mart-delivery');
        return stored ? JSON.parse(stored) : INITIAL_DELIVERY;
    } catch {
        return INITIAL_DELIVERY;
    }
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(loadStoredItems);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>(loadStoredDelivery);

    useEffect(() => {
        localStorage.setItem('lekki-mart-cart', JSON.stringify(items));
        localStorage.setItem('lekki-mart-delivery', JSON.stringify(deliveryInfo));

        const count = items.reduce((acc, item) => acc + item.quantity, 0);
        document.cookie = `cart_count=${count}; path=/; max-age=31536000; SameSite=Strict`;
    }, [items, deliveryInfo]);

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
