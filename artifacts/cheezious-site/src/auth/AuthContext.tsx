import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const AUTH_STORAGE_KEY = 'underconstruction-auth-v1';
export const DEFAULT_SAVED_ADDRESS = 'House 456 — E 7, Islamabad, Islamabad Capital Territory';

type AuthState = {
  userPhone: string | null;
  savedAddresses: string[];
  selectedAddress: string | null;
};

type AuthContextValue = AuthState & {
  logIn: (phone: string) => void;
  logOut: () => void;
  addAddress: (address: string) => void;
  selectAddress: (address: string) => void;
};

const defaultState: AuthState = {
  userPhone: null,
  savedAddresses: [DEFAULT_SAVED_ADDRESS],
  selectedAddress: null,
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
    logOut: () => setState((current) => ({ ...current, userPhone: null, selectedAddress: null })),
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
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
