import * as SecureStore from 'expo-secure-store';
import {create} from 'zustand';

type OnboardingState = {
  hasSeenGetStarted: boolean | null;
  isBootstrapping: boolean;
  bootstrap: () => Promise<void>;
  setHasSeenGetStarted: (value: boolean) => Promise<void>;
  reset: () => Promise<void>;
};

const HAS_SEEN_GET_STARTED_KEY = 'campuslink.hasSeenGetStarted';

export const onboardingStore = create<OnboardingState>(set => ({
  hasSeenGetStarted: null,
  isBootstrapping: true,

  bootstrap: async () => {
    set({isBootstrapping: true});
    const v = await SecureStore.getItemAsync(HAS_SEEN_GET_STARTED_KEY);
    set({hasSeenGetStarted: v === '1', isBootstrapping: false});
  },

  setHasSeenGetStarted: async value => {
    if (value) {
      await SecureStore.setItemAsync(HAS_SEEN_GET_STARTED_KEY, '1');
    } else {
      await SecureStore.deleteItemAsync(HAS_SEEN_GET_STARTED_KEY);
    }
    set({hasSeenGetStarted: value});
  },

  reset: async () => {
    await SecureStore.deleteItemAsync(HAS_SEEN_GET_STARTED_KEY);
    set({hasSeenGetStarted: false});
  }
}));

export const useOnboardingStore = onboardingStore;
