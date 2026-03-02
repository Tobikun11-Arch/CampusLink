import {useMutation} from '@tanstack/react-query';
import {router, useLocalSearchParams} from 'expo-router';
import React, {useState} from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';

import {verify} from '../../src/features/auth/api/auth.api';

export default function VerifyScreen() {
  const {email} = useLocalSearchParams<{email?: string}>();
  const loginHref = '/(auth)/login' as any;

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: verify,
    onSuccess: () => {
      router.replace(loginHref);
    },
    onError: (e: any) => {
      setError(
        e?.response?.data?.message ?? e?.message ?? 'Verification failed'
      );
    }
  });

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-gray-900">Verify Email</Text>
      <Text className="text-gray-500 mt-2">
        Enter the code sent to {email ?? 'your email'}.
      </Text>

      <View className="mt-8">
        <Text className="text-xs text-gray-500 mb-2">VERIFICATION CODE</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
          placeholder="123456"
        />

        {error ? <Text className="text-red-600 mt-3">{error}</Text> : null}

        <Pressable
          className={`mt-6 rounded-xl py-4 items-center ${mutation.isPending ? 'bg-gray-300' : 'bg-green-500'}`}
          disabled={mutation.isPending}
          onPress={() => {
            if (!email) {
              setError('Missing email');
              return;
            }
            setError(null);
            mutation.mutate({email, code});
          }}
        >
          <Text className="text-white font-semibold">
            {mutation.isPending ? 'Verifying…' : 'Verify'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
