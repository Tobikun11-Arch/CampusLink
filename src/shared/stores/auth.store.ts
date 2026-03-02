import * as SecureStore from 'expo-secure-store';
import {create} from 'zustand';

type Role = 'NORMAL' | 'OFFICER' | 'PRESIDENT';

type AuthState = {
  accessToken: string | null;
  isBootstrapping: boolean;
  setAccessToken: (token: string | null) => Promise<void>;
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;

  role: Role | null;
  setRole: (role: Role | null) => void;
};

const ACCESS_TOKEN_KEY = 'campuslink.accessToken';

export const authStore = create<AuthState>((set, get) => ({
  accessToken: null,
  isBootstrapping: true,
  role: null,

  setRole: role => set({role}),

  setAccessToken: async token => {
    if (token) {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    }

    set({accessToken: token});
  },

  bootstrap: async () => {
    set({isBootstrapping: true});
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    set({accessToken: token ?? null, isBootstrapping: false});
  },

  logout: async () => {
    await get().setAccessToken(null);
    set({role: null});
  }
}));

export const useAuthStore = authStore;
