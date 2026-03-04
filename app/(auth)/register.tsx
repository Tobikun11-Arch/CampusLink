import {useMutation} from '@tanstack/react-query';
import {Ionicons} from '@expo/vector-icons';
import {Image} from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import {router} from 'expo-router';
import React, {useMemo, useState} from 'react';
import {Modal, Pressable, Text, TextInput, View} from 'react-native';

import {register} from '../../src/features/auth/api/auth.api';

type Role = 'NORMAL' | 'OFFICER' | 'PRESIDENT';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [campus, setCampus] = useState('Indang');
  const [role, setRole] = useState<Role>('NORMAL');
  const [roleProof, setRoleProof] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showProofInfo, setShowProofInfo] = useState(false);

  const requiresProof = role === 'OFFICER' || role === 'PRESIDENT';

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: data => {
      router.replace({
        pathname: '/(auth)/verify',
        params: {email: data.email}
      } as any);
    },
    onError: (err: any) => {
      console.log(err);
      setError(
        err?.response?.data?.message ?? err?.message ?? 'Registration failed'
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
    <View className="flex-1 bg-white px-7">
      <View className="flex-1 justify-center">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-extrabold text-gray-900">
              Create Account
            </Text>
            <Text className="text-gray-500 mt-2">
              Join the CampusLink community
            </Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
            <Ionicons name="person-add-outline" size={18} color="#16a34a" />
          </View>
        </View>

        <View className="mt-7">
          <View className="items-center">
            <Image
              source={require('../../assets/images/CampusLink_Logo_transparent.png')}
              contentFit="contain"
              style={{width: 44, height: 44}}
            />
          </View>

          <Text className="mt-6 text-xs font-extrabold text-green-600 tracking-widest">
            PERSONAL DETAILS
          </Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-[10px] text-gray-500 mb-2 mt-3">FIRST NAME</Text>
            <TextInput
              className="rounded-2xl px-4 py-4 bg-gray-50"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Juan"
            />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] text-gray-500 mb-2 mt-3">LAST NAME</Text>
            <TextInput
              className="rounded-2xl px-4 py-4 bg-gray-50"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Dela Cruz"
            />
          </View>
        </View>

        <Text className="mt-6 text-xs font-extrabold text-green-600 tracking-widest">
          VERIFICATION
        </Text>
        <Text className="text-[10px] text-gray-500 mb-2 mt-3">UNIVERSITY EMAIL</Text>
        <View className="relative">
          <TextInput
            className="rounded-2xl px-4 py-4 pr-12 bg-gray-50"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="yourname@university.edu"
          />
          <View className="absolute right-4 top-0 bottom-0 justify-center">
            <Ionicons name="at-outline" size={18} color="#22c55e" />
          </View>
        </View>
        <Text className="text-gray-400 text-xs mt-2">
          Use your official university email for instant verification.
        </Text>

        <Text className="mt-6 text-xs font-extrabold text-green-600 tracking-widest">
          SECURITY
        </Text>
        <Text className="text-[10px] text-gray-500 mb-2 mt-3">CREATE PASSWORD</Text>
        <View className="relative">
          <TextInput
            className="rounded-2xl px-4 py-4 pr-12 bg-gray-50"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
          />
          <Pressable
            className="absolute right-4 top-0 bottom-0 justify-center"
            onPress={() => setShowPassword(v => !v)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color="#9CA3AF"
            />
          </Pressable>
        </View>

        <Text className="text-[10px] text-gray-500 mb-2 mt-6">CAMPUS</Text>
        <TextInput
          className="rounded-2xl px-4 py-4 bg-gray-50"
          value={campus}
          onChangeText={setCampus}
          placeholder="Indang"
        />

        <Text className="text-[10px] text-gray-500 mb-2 mt-6">TYPE</Text>
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
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-extrabold text-green-600 tracking-widest">
                PROOF OF ENROLLMENT
              </Text>
              <Pressable
                className="w-7 h-7 rounded-full bg-green-100 items-center justify-center"
                onPress={() => setShowProofInfo(true)}
              >
                <Ionicons name="help" size={14} color="#16a34a" />
              </Pressable>
            </View>
            <Pressable
              className="border border-dashed border-green-300 rounded-2xl py-6 items-center bg-green-50"
              onPress={pickProof}
            >
              <View className="w-12 h-12 rounded-full bg-green-200 items-center justify-center">
                <Ionicons name="cloud-upload-outline" size={22} color="#16a34a" />
              </View>
              <Text className="mt-3 text-gray-900 font-bold">Upload Document</Text>
              <Text className="mt-1 text-gray-500 text-xs text-center">
                ID, Enrollment Form, or Appointment{`\n`}Paper (Max 5MB)
              </Text>
              {roleProof ? (
                <Text className="text-gray-500 mt-3">{roleProof.name}</Text>
              ) : null}
            </Pressable>

            <Modal
              transparent
              visible={showProofInfo}
              animationType="fade"
              onRequestClose={() => setShowProofInfo(false)}
            >
              <Pressable
                className="flex-1 bg-black/40 px-7 justify-center"
                onPress={() => setShowProofInfo(false)}
              >
                <Pressable
                  className="bg-white rounded-2xl p-5"
                  onPress={() => null}
                >
                  <Text className="text-gray-900 font-extrabold text-lg">
                    Why do we need this?
                  </Text>
                  <Text className="text-gray-600 mt-2">
                    Officers and class presidents must upload proof so we can verify your role before granting role-based access.
                  </Text>
                  <Pressable
                    className="mt-5 rounded-2xl bg-green-500 py-3 items-center"
                    onPress={() => setShowProofInfo(false)}
                  >
                    <Text className="text-white font-bold">Got it</Text>
                  </Pressable>
                </Pressable>
              </Pressable>
            </Modal>
          </View>
        ) : null}

        {error ? <Text className="text-red-600 mt-3">{error}</Text> : null}

        <Pressable
          className={`mt-8 rounded-2xl py-5 items-center ${mutation.isPending ? 'bg-gray-300' : 'bg-green-500'}`}
          disabled={mutation.isPending}
          onPress={() => {
            setError(null);

            // Validation checks
            if (
              !firstName.trim() ||
              !lastName.trim() ||
              !email.trim() ||
              !password.trim() ||
              !campus.trim()
            ) {
              setError('Please fill in all required fields.');
              return;
            }

            if (requiresProof && !roleProof) {
              setError('Proof image is required for this role.');
              return;
            }

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
            {mutation.isPending ? 'Creating…' : 'Complete Registration'}
          </Text>
        </Pressable>

        <Pressable
          className="mt-4 items-center flex-row justify-center"
          onPress={() => router.replace(loginHref)}
        >
          <Text className="text-gray-600">Already have an account? </Text>
          <Text className="text-green-600 font-semibold">Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
