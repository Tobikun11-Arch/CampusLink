import {Image} from 'expo-image';
import {router} from 'expo-router';
import React, {useEffect, useMemo, useState} from 'react';
import {Pressable, Text, View} from 'react-native';

import {useOnboardingStore} from '../../src/shared/stores/onboarding.store';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function GetStartedScreen() {
  const setHasSeenGetStarted = useOnboardingStore(s => s.setHasSeenGetStarted);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => clamp(p + 0.015, 0, 1));
    }, 30);

    return () => clearInterval(id);
  }, []);

  const progressPct = useMemo(
    () => `${Math.round(progress * 100)}%` as `${number}%`,
    [progress]
  );

  return (
    <View className="flex-1 bg-[#EAF8EF] px-7">
      <View className="flex-1 items-center justify-center">
        <View className="items-center">
          <Image
            source={require('../../assets/images/CampusLink_Logo_transparent.png')}
            contentFit="contain"
            style={{width: 200, height: 200}}
          />

          <View className="items-center">
            <Text className="mt-3 text-center text-gray-600 font-semibold text-xl">
              One app, 10+ campuses, one{`\n`}community
            </Text>

            <Text className="mt-5 text-center text-gray-500 tracking-widest text-xs font-semibold">
              VERIFIED. SAFE. CONNECTED.
            </Text>

            <Text className="mt-10 text-center text-gray-400 tracking-[3px] text-xs font-bold">
              INITIALIZING ECOSYSTEM...
            </Text>

            <View className="mt-4 w-64 h-2 rounded-full bg-green-100 overflow-hidden">
              <View
                className="h-2 rounded-full bg-green-500"
                style={{width: progressPct}}
              />
            </View>

            <Pressable
              className="mt-9 w-72 rounded-2xl bg-green-500 py-4 items-center"
              onPress={async () => {
                await setHasSeenGetStarted(true);
                router.replace('/(auth)/login' as any);
              }}
            >
              <Text className="text-white font-bold text-base">
                Get Started
              </Text>
            </Pressable>

            <Text className="mt-8 text-gray-300 tracking-[4px] text-[10px] font-bold">
              REBRANDED EDITION
            </Text>

            <View className="mt-3 flex-row items-center justify-center">
              <View className="w-6 h-1.5 rounded-full bg-green-500" />
              <View className="ml-2 w-1.5 h-1.5 rounded-full bg-green-200" />
              <View className="ml-2 w-1.5 h-1.5 rounded-full bg-green-200" />
              <View className="ml-2 w-1.5 h-1.5 rounded-full bg-green-200" />
              <View className="ml-2 w-1.5 h-1.5 rounded-full bg-green-200" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
