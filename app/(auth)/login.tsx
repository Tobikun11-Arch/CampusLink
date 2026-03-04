import {Ionicons} from '@expo/vector-icons';
import {useMutation} from '@tanstack/react-query';
import {Image} from 'expo-image';
import {Link, router} from 'expo-router';
import React, {useState} from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';

import {login} from '../../src/features/auth/api/auth.api';
import {useAuthStore} from '../../src/shared/stores/auth.store';

export default function LoginScreen() {
  const setAccessToken = useAuthStore(s => s.setAccessToken);
  const tabsHref = '/(tabs)' as any;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <View className="flex-1 bg-white px-7">
      <View className="flex-1 justify-center">
        <View className="items-center">
          <View className="w-24 h-24 rounded-3xl bg-green-100 items-center justify-center">
            <Image
              source={require('../../assets/images/CampusLink_Logo_transparent.png')}
              contentFit="contain"
              style={{width: 56, height: 56}}
            />
          </View>
          <Text className="mt-4 text-gray-900 font-extrabold text-lg">
            CampusLink
          </Text>
        </View>

        <Text className="mt-10 text-4xl font-extrabold text-gray-900">
          Welcome Back
        </Text>
        <Text className="mt-3 text-gray-500">
          Sign in to stay connected with your{`\n`}campus
        </Text>

        <View className="mt-10">
          <Text className="text-xs font-bold text-gray-700 mb-2">
            University Email
          </Text>
          <TextInput
            className="border border-gray-100 rounded-2xl px-4 py-4 bg-white"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="name@university.edu"
          />

          <Text className="text-xs font-bold text-gray-700 mb-2 mt-6">
            Password
          </Text>
          <View className="relative">
            <TextInput
              className="border border-gray-100 rounded-2xl px-4 py-4 pr-12 bg-white"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
            />
            <Pressable
              className="absolute right-4 top-0 bottom-0 justify-center"
              onPress={() => setShowPassword(v => !v)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#9CA3AF"
              />
            </Pressable>
          </View>

          <Pressable className="mt-4 self-end">
            <Text className="text-green-600 font-semibold">
              Forgot Password?
            </Text>
          </Pressable>

          {error ? <Text className="text-red-600 mt-3">{error}</Text> : null}

          <Pressable
            className={`mt-8 rounded-2xl py-5 items-center ${mutation.isPending ? 'bg-gray-300' : 'bg-green-500'}`}
            disabled={mutation.isPending}
            onPress={() => {
              setError(null);
              mutation.mutate({email, password});
            }}
          >
            <Text className="text-white font-bold text-base">
              {mutation.isPending ? 'Logging in…' : 'Log In'}
            </Text>
          </Pressable>
          <View className="mt-8 flex-row justify-center">
            <Text className="text-gray-400">Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text className="text-green-600 font-semibold">Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}
