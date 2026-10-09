import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { NativeModules } from 'react-native';
import { STUDENT } from '@constants/student';

export interface CartItem {
  id: number;
  title: string;
  price: number; // Gi?? ???? nh??n PRICE_MULTIPLIER
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  shippingFee: number | null;
  distanceKm: number | null;

  // Actions b???t bu???c: add / remove / changeQty / totalQuantity / totalAmount
  addItem: (product: { id: number; title: string; price: number; image: string }) => void;
  removeItem: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
  clearCart: () => void;

  setShippingFee: (fee: number | null) => void;
  setDistanceKm: (km: number | null) => void;

  totalQuantity: () => number;
  totalAmount: () => number;
}

// Ki???m tra xem native module c???a AsyncStorage c?? tr??n APK hi???n t???i kh??ng
const hasNativeAsyncStorage = Boolean(
  NativeModules?.PlatformLocalStorage ||
  NativeModules?.RNC_AsyncSQLiteDBStorage ||
  NativeModules?.RNCAsyncStorage ||
  NativeModules?.AsyncSQLiteDBStorage ||
  NativeModules?.AsyncLocalStorage
);

const memoryStorage = new Map<string, string>();

let nativeStorageInstance: any = null;
if (hasNativeAsyncStorage) {
  try {
    nativeStorageInstance = require('@react-native-async-storage/async-storage').default;
  } catch (_e) {
    nativeStorageInstance = null;
  }
}

const safeAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (nativeStorageInstance) {
      return await nativeStorageInstance.getItem(key);
    }
    return memoryStorage.get(key) ?? null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (nativeStorageInstance) {
      await nativeStorageInstance.setItem(key, value);
    } else {
      memoryStorage.set(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (nativeStorageInstance) {
      await nativeStorageInstance.removeItem(key);
    } else {
      memoryStorage.delete(key);
    }
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingFee: null,
      distanceKm: null,

      addItem: (product) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === product.id);
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += 1;
            return { items: updated };
          }
          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      changeQty: (id, delta) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);
          return { items: updated };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setShippingFee: (fee) => {
        set({ shippingFee: fee });
      },

      setDistanceKm: (km) => {
        set({ distanceKm: km });
      },

      totalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`, // Persist key c?? MSSV: ktxgo-cart-23725521
      storage: createJSONStorage(() => safeAsyncStorage),
      partialize: (state) => ({
        items: state.items,
        shippingFee: state.shippingFee,
        distanceKm: state.distanceKm,
      }),
    },
  ),
);

