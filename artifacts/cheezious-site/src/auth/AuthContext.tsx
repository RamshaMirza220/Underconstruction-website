import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const AUTH_STORAGE_KEY = 'underconstruction-auth-v1';
export const DEFAULT_SAVED_ADDRESS = 'House 456 — E 7, Islamabad, Islamabad Capital Territory';

export type OrderMode = 'delivery' | 'pickup';
export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  image: string;
  variation: string;
};
export type Order = {
  id: string;
  createdAt: string;
  status: 'Confirmed';
  items: OrderItem[];
  mode: OrderMode;
  address: string;
  paymentMethod: 'Cash on Delivery' | 'Debit/Credit Card' | 'JazzCash';
  instructions: string;
  subtotal: number;
  discount: number;
  tax: number;
  taxRate: number;
  total: number;
  voucherCode?: string;
};

type AuthState = {
  userPhone: string | null;
  savedAddresses: string[];
  selectedAddress: string | null;
  mode: OrderMode;
  favorites: string[];
  orders: Order[];
  profile: { name: string; dob: string };
};

type AuthContextValue = AuthState & {
  logIn: (phone: string) => void;
  logOut: () => void;
  addAddress: (address: string) => void;
  selectAddress: (address: string) => void;
  removeAddress: (address: string) => void;
  setMode: (mode: OrderMode) => void;
  toggleFavorite: (id: string) => void;
  addOrder: (order: Order) => void;
  updateProfile: (profile: { name: string; dob: string }) => void;
};

const defaultState: AuthState = {
  userPhone: null,
  savedAddresses: [DEFAULT_SAVED_ADDRESS],
  selectedAddress: null,
  mode: 'delivery',
  favorites: [],
  orders: [],
  profile: { name: '', dob: '' },
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredAuth(): AuthState {
  try {
    const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return defaultState;

    const parsed = JSON.parse(saved) as Partial<AuthState>;
    const savedAddresses = Array.isArray(parsed.savedAddresses)
      ? parsed.savedAddresses.filter((address): address is string => typeof address === 'string' && address.trim().length > 0)
      : [];
    const addresses = savedAddresses.length ? savedAddresses : [DEFAULT_SAVED_ADDRESS];
    const selectedAddress = typeof parsed.selectedAddress === 'string' && addresses.includes(parsed.selectedAddress)
      ? parsed.selectedAddress
      : null;

    return {
      userPhone: typeof parsed.userPhone === 'string' ? parsed.userPhone : null,
      savedAddresses: addresses,
      selectedAddress,
      mode: parsed.mode === 'pickup' ? 'pickup' : 'delivery',
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites.filter((id): id is string => typeof id === 'string') : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders.filter((order): order is Order => Boolean(order && typeof order.id === 'string' && Array.isArray(order.items))) : [],
      profile: {
        name: typeof parsed.profile?.name === 'string' ? parsed.profile.name : '',
        dob: typeof parsed.profile?.dob === 'string' ? parsed.profile.dob : '',
      },
    };
  } catch {
    return defaultState;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(readStoredAuth);

  useEffect(() => {
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Authentication remains usable for this session if storage is unavailable.
    }
  }, [state]);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    logIn: (phone) => setState((current) => ({ ...current, userPhone: phone })),
    logOut: () => setState((current) => ({
      ...current,
      userPhone: null,
      selectedAddress: null,
      savedAddresses: [DEFAULT_SAVED_ADDRESS],
      favorites: [],
      orders: [],
      profile: { name: '', dob: '' },
    })),
    setMode: (mode) => setState((current) => ({ ...current, mode })),
    toggleFavorite: (id) => setState((current) => ({
      ...current,
      favorites: current.favorites.includes(id)
        ? current.favorites.filter((favorite) => favorite !== id)
        : [...current.favorites, id],
    })),
    addOrder: (order) => setState((current) => ({ ...current, orders: [order, ...current.orders] })),
    updateProfile: (profile) => setState((current) => ({ ...current, profile })),
    addAddress: (address) => {
      const normalized = address.trim();
      if (!normalized) return;
      setState((current) => current.savedAddresses.includes(normalized)
        ? current
        : { ...current, savedAddresses: [...current.savedAddresses, normalized] });
    },
    selectAddress: (address) => {
      setState((current) => ({
        ...current,
        savedAddresses: current.savedAddresses.includes(address)
          ? current.savedAddresses
          : [...current.savedAddresses, address],
        selectedAddress: address,
      }));
    },
    removeAddress: (address) => setState((current) => {
      const addresses = current.savedAddresses.filter((savedAddress) => savedAddress !== address);
      return {
        ...current,
        savedAddresses: addresses,
        selectedAddress: current.selectedAddress === address ? null : current.selectedAddress,
      };
    }),
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
