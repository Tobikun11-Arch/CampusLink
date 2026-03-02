import {useMutation} from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import {router} from 'expo-router';
import React, {useMemo, useState} from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';

import {register} from '../../src/features/auth/api/auth.api';

type Role = 'NORMAL' | 'OFFICER' | 'PRESIDENT';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState('Indang');
  const [role, setRole] = useState<Role>('NORMAL');
  const [roleProof, setRoleProof] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requiresProof = role === 'OFFICER' || role === 'PRESIDENT';

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: data => {
      router.replace({
        pathname: '/(auth)/verify',
        params: {email: data.email}
      } as any);
    },
    onError: (e: any) => {
      setError(
        e?.response?.data?.message ?? e?.message ?? 'Registration failed'
      );
    }
  });

  const roleLabel = useMemo(() => {
    if (role === 'NORMAL') return 'Normal Student';
    if (role === 'OFFICER') return 'Org Officer';
    return 'Class President';
  }, [role]);

  const loginHref = '/(auth)/login' as any;

  async function pickProof() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9
    });

    if (result.canceled) return;
    const asset = result.assets[0];

    setRoleProof({
      uri: asset.uri,
      name: asset.fileName ?? 'role-proof.jpg',
      type: asset.mimeType ?? 'image/jpeg'
    });
  }

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-gray-900">Register</Text>
      <Text className="text-gray-500 mt-2">
        CvSU students only — verified via email.
      </Text>

      <View className="mt-8">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-2">FIRST NAME</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Juan"
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-2">LAST NAME</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Dela Cruz"
            />
          </View>
        </View>

        <Text className="text-xs text-gray-500 mb-2 mt-4">
          UNIVERSITY EMAIL
        </Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="student@cvsu.edu.ph"
        />

        <Text className="text-xs text-gray-500 mb-2 mt-4">CREATE PASSWORD</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="password123"
        />

        <Text className="text-xs text-gray-500 mb-2 mt-4">CAMPUS</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3"
          value={campus}
          onChangeText={setCampus}
          placeholder="Indang"
        />

        <Text className="text-xs text-gray-500 mb-2 mt-4">ROLE</Text>
        <View className="flex-row gap-2">
          {(['NORMAL', 'OFFICER', 'PRESIDENT'] as Role[]).map(r => {
            const active = role === r;
            return (
              <Pressable
                key={r}
                className={`px-3 py-2 rounded-xl border ${active ? 'bg-green-500 border-green-500' : 'bg-white border-gray-200'}`}
                onPress={() => setRole(r)}
              >
                <Text
                  className={
                    active ? 'text-white font-semibold' : 'text-gray-700'
                  }
                >
                  {r}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text className="text-gray-500 mt-2">Selected: {roleLabel}</Text>

        {requiresProof ? (
          <View className="mt-4">
            <Text className="text-xs text-gray-500 mb-2">
              UPLOAD PROOF (JPG/PNG)
            </Text>
            <Pressable
              className="border border-dashed border-green-400 rounded-xl py-5 items-center"
              onPress={pickProof}
            >
              <Text className="text-green-700 font-semibold">
                {roleProof ? 'Change proof' : 'Select image'}
              </Text>
              {roleProof ? (
                <Text className="text-gray-500 mt-2">{roleProof.name}</Text>
              ) : null}
            </Pressable>
          </View>
        ) : null}

        {error ? <Text className="text-red-600 mt-3">{error}</Text> : null}

        <Pressable
          className={`mt-6 rounded-xl py-4 items-center ${mutation.isPending ? 'bg-gray-300' : 'bg-green-500'}`}
          disabled={mutation.isPending}
          onPress={() => {
            setError(null);
            mutation.mutate({
              firstName,
              lastName,
              email,
              password,
              campus,
              role,
              roleProof
            });
          }}
        >
          <Text className="text-white font-semibold">
            {mutation.isPending ? 'Creating…' : 'Create account'}
          </Text>
        </Pressable>

        <Pressable
          className="mt-4 items-center"
          onPress={() => router.replace(loginHref)}
        >
          <Text className="text-green-600 font-semibold">
            Already have an account? Login
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
