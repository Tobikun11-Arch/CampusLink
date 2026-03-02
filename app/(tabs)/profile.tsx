import {useQuery} from '@tanstack/react-query';
import {router} from 'expo-router';
import React from 'react';
import {Pressable, Text, View} from 'react-native';

import {getMe} from '../../src/features/profile/api/profile.api';
import {useAuthStore} from '../../src/shared/stores/auth.store';

export default function ProfileScreen() {
  const logout = useAuthStore(s => s.logout);
  const loginHref = '/(auth)/login' as any;

  const meQuery = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: getMe
  });

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-gray-900">Profile</Text>

      {meQuery.isLoading ? (
        <Text className="text-gray-500 mt-4">Loading…</Text>
      ) : null}
      {meQuery.error ? (
        <Text className="text-red-600 mt-4">Failed to load profile.</Text>
      ) : null}

      {meQuery.data ? (
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-900">
            {meQuery.data.firstName} {meQuery.data.lastName}
          </Text>
          <Text className="text-gray-500 mt-1">{meQuery.data.email}</Text>
          <Text className="text-gray-500 mt-1">
            Campus: {meQuery.data.campus}
          </Text>
        </View>
      ) : null}

      <Pressable
        className="mt-10 bg-gray-900 rounded-xl py-4 items-center"
        onPress={async () => {
          await logout();
          router.replace(loginHref);
        }}
      >
        <Text className="text-white font-semibold">Logout</Text>
      </Pressable>
    </View>
  );
}
