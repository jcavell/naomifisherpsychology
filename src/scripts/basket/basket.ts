import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';
import type { BasketItem } from "../../types/basket-item";

// Main store using an array to maintain order
export const basketStore = persistentAtom<BasketItem[]>(
    'basket:',
    [],
    {
        encode: JSON.stringify,
        decode: (value: string) => {
            if (typeof window === 'undefined') return [];
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
    }
);

// Helper to get current state
const getBasket = () => basketStore.get();

// Public API
export const getBasketItems = computed(basketStore, $basket => $basket);

export const getBasketItem = (id: string) =>
    computed(basketStore, $basket => $basket.find(item => item.id === id));

export const getItemCount = computed(basketStore, $basket => $basket.length);

export const getIsEmpty = computed(getItemCount, $count => $count === 0);

export const getTotalPrice = computed(basketStore, $basket =>
    $basket.reduce((sum, item) => sum + item.price, 0)
);

export const isInBasket = (id: string) =>
    getBasket().some(item => item.id === id);

export function addItem(item: BasketItem) {
    basketStore.set([...getBasket(), item]); // New items added to end
}

export function removeItem(id: string) {
    basketStore.set(getBasket().filter(item => item.id !== id));
}

export function emptyBasket() {
    basketStore.set([]);
}