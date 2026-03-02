import {useMutation} from '@tanstack/react-query';
import {Link, router} from 'expo-router';
import React, {useState} from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';

import {login} from '../../src/features/auth/api/auth.api';
import {useAuthStore} from '../../src/shared/stores/auth.store';

export default function LoginScreen() {
  const setAccessToken = useAuthStore(s => s.setAccessToken);

  const registerHref = '/(auth)/register' as any;
  const tabsHref = '/(tabs)' as any;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async data => {
      await setAccessToken(data.accessToken);
      router.replace(tabsHref);
    },
    onError: (e: any) => {
      setError(e?.response?.data?.message ?? e?.message ?? 'Login failed');
    }
  });

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-gray-900">Login</Text>
      <Text className="text-gray-500 mt-2">
        Use your CvSU email to continue.
      </Text>

      <View className="mt-8">
        <Text className="text-xs text-gray-500 mb-2">UNIVERSITY EMAIL</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="student@cvsu.edu.ph"
        />

        <Text className="text-xs text-gray-500 mb-2 mt-4">PASSWORD</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
        />

        {error ? <Text className="text-red-600 mt-3">{error}</Text> : null}

        <Pressable
          className={`mt-6 rounded-xl py-4 items-center ${mutation.isPending ? 'bg-gray-300' : 'bg-green-500'}`}
          disabled={mutation.isPending}
          onPress={() => {
            setError(null);
            mutation.mutate({email, password});
          }}
        >
          <Text className="text-white font-semibold">
            {mutation.isPending ? 'Logging in…' : 'Login'}
          </Text>
        </Pressable>
        {registerHref}
        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-600">No account? </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text className="text-green-600 font-semibold">Register</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
