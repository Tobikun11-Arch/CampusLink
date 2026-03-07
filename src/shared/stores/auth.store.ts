import * as SecureStore from 'expo-secure-store';
import {create} from 'zustand';

type Role = 'NORMAL' | 'OFFICER' | 'PRESIDENT';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isBootstrapping: boolean;
  setTokens: (
    accessToken: string | null,
    refreshToken: string | null
  ) => Promise<void>;
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;
  role: Role | null;
  setRole: (role: Role | null) => void;
};

const ACCESS_TOKEN_KEY = 'campuslink.accessToken';
const REFRESH_TOKEN_KEY = 'campuslink.refreshToken';

export const authStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  isBootstrapping: true,
  role: null,

  setRole: role => set({role}),

  setTokens: async (accessToken, refreshToken) => {
    if (accessToken) {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    }

    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }

    set({accessToken, refreshToken});
  },

  bootstrap: async () => {
    set({isBootstrapping: true});
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    set({
      accessToken: accessToken ?? null,
      refreshToken: refreshToken ?? null,
      isBootstrapping: false
    });
  },

  logout: async () => {
    await get().setTokens(null, null);
    set({role: null});
  }
}));

export const useAuthStore = authStore;
