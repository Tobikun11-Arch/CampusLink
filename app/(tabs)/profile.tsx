import React, {useMemo, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';

import {
  getMe,
  updateMe,
  type UpdateMeInput
} from '../../src/features/profile/api/profile.api';
import {useAppMutation, useAppQuery} from '../../src/shared/api/query';

function StatCard({
  label,
  value,
  accent
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <View className="flex-1 bg-white rounded-2xl border border-gray-100 px-4 py-3">
      <Text className="text-[10px] tracking-widest text-gray-400 font-extrabold">
        {label}
      </Text>
      <Text
        className={
          accent
            ? `text-xl font-extrabold ${accent}`
            : 'text-xl font-extrabold text-gray-900'
        }
      >
        {value}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const meQuery = useAppQuery({
    queryKey: ['profile', 'me'],
    queryFn: getMe
  });

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<UpdateMeInput>({});

  const saveMutation = useAppMutation({
    mutationFn: (input: UpdateMeInput) => updateMe(input),
    invalidateQueries: [['profile', 'me']],
    onSuccess: () => {
      setIsEditing(false);
    }
  });

  const displayName = useMemo(() => {
    if (!meQuery.data) return 'Student';
    return `${meQuery.data.firstName} ${meQuery.data.lastName}`.trim();
  }, [meQuery.data]);

  const campusLine = useMemo(() => {
    if (!meQuery.data) return '';
    return `${meQuery.data.campus ?? ''}`;
  }, [meQuery.data]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 28}}
      >
        <View className="">
          <View className="h-40 bg-green-600" />
          <View className="absolute right-5 top-6">
            <Pressable className="bg-white/20 px-4 py-2 rounded-full">
              <Text className="text-white font-extrabold text-xs">
                EDIT COVER
              </Text>
            </Pressable>
          </View>
          <View className="absolute self-center top-20">
            <View className="h-28 w-28 rounded-full bg-white items-center justify-center">
              <View className="h-24 w-24 rounded-full bg-gray-200" />
              <View className="absolute right-1 bottom-1 h-7 w-7 rounded-full bg-green-500 items-center justify-center border-2 border-white">
                <Text className="text-white font-extrabold">+</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 mt-16 items-center">
          <Text className="text-2xl font-extrabold text-gray-900">
            {displayName}
          </Text>
          <Text className="text-gray-500 mt-1">
            {campusLine ? `${campusLine}` : 'Campus'}
          </Text>
          <Text className="text-gray-400 mt-1 text-xs tracking-widest font-bold">
            UNIVERSITY STUDENT
          </Text>

          <Pressable
            className="mt-4 bg-green-500 w-full py-4 rounded-2xl items-center"
            onPress={() => {
              if (!meQuery.data) return;
              setDraft({
                course: meQuery.data.course ?? undefined,
                yearLevel: meQuery.data.yearLevel ?? undefined,
                bio: meQuery.data.bio ?? undefined,
                interests: meQuery.data.interests ?? undefined
              });
              setIsEditing(v => !v);
            }}
          >
            <Text className="text-white font-extrabold">Edit Profile</Text>
          </Pressable>
        </View>

        <View className="px-5 mt-5">
          {meQuery.isLoading ? (
            <Text className="text-gray-500">Loading…</Text>
          ) : null}
          {meQuery.error ? (
            <Text className="text-red-600">Failed to load profile.</Text>
          ) : null}
        </View>

        <View className="px-5 mt-4">
          <View className="flex-row gap-3">
            <StatCard
              label="CONTRIBUTION SCORE"
              value={`${meQuery.data?.contributionScore ?? 2840} pts`}
            />
            <StatCard
              label="GLOBAL RANK"
              value={`#${meQuery.data?.globalRank ?? 12}`}
              accent="text-green-600"
            />
          </View>

          <View className="bg-white rounded-2xl border border-gray-100 px-4 py-4 mt-4">
            <Text className="text-[10px] tracking-widest text-green-600 font-extrabold">
              NEXT MILESTONE
            </Text>
            <Text className="text-gray-900 font-extrabold text-base mt-1">
              Community Leader
            </Text>
            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-gray-400 text-xs">450 / 500 XP</Text>
            </View>
            <View className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
              <View className="h-2 bg-green-500" style={{width: '90%'}} />
            </View>
            <Text className="text-gray-400 text-xs mt-3">
              Earn 50 more XP to unlock the Leader badge
            </Text>
          </View>
        </View>

        {isEditing ? (
          <View className="px-5 mt-5">
            <View className="bg-white rounded-2xl border border-gray-100 px-4 py-4">
              <Text className="text-gray-900 font-extrabold">Edit details</Text>
              <View className="mt-3">
                <Text className="text-gray-500 text-xs font-bold mb-1">
                  Course
                </Text>
                <TextInput
                  value={draft.course ?? ''}
                  onChangeText={t => setDraft(d => ({...d, course: t}))}
                  className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="e.g. BSIT"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View className="mt-3">
                <Text className="text-gray-500 text-xs font-bold mb-1">
                  Year level
                </Text>
                <TextInput
                  value={draft.yearLevel ?? ''}
                  onChangeText={t => setDraft(d => ({...d, yearLevel: t}))}
                  className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="e.g. 3"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View className="mt-3">
                <Text className="text-gray-500 text-xs font-bold mb-1">
                  Bio
                </Text>
                <TextInput
                  value={draft.bio ?? ''}
                  onChangeText={t => setDraft(d => ({...d, bio: t}))}
                  className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="Write something about you"
                  placeholderTextColor="#9CA3AF"
                  multiline
                />
              </View>

              <View className="flex-row items-center mt-4">
                <Pressable
                  className="flex-1 bg-green-500 py-4 rounded-2xl items-center"
                  disabled={saveMutation.isPending}
                  onPress={() => saveMutation.mutate(draft)}
                >
                  <Text className="text-white font-extrabold">
                    {saveMutation.isPending ? 'Saving…' : 'Save'}
                  </Text>
                </Pressable>
                <Pressable
                  className="ml-3 flex-1 bg-white py-4 rounded-2xl border border-gray-200 items-center"
                  onPress={() => setIsEditing(false)}
                >
                  <Text className="text-gray-900 font-extrabold">Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}

        <View className="px-5 mt-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900 font-extrabold">Badges Gallery</Text>
            <Pressable>
              <Text className="text-green-600 font-extrabold">View All</Text>
            </Pressable>
          </View>

          <View className="flex-row mt-4 gap-4">
            <View className="flex-1 bg-white rounded-2xl border border-gray-100 px-3 py-4 items-center">
              <View className="h-14 w-14 rounded-full bg-yellow-400 items-center justify-center">
                <Text className="text-white font-extrabold">+</Text>
              </View>
              <Text className="text-gray-900 font-extrabold mt-3">Savior</Text>
              <Text className="text-gray-400 text-xs text-center mt-1">
                Provided vital campus
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl border border-gray-100 px-3 py-4 items-center">
              <View className="h-14 w-14 rounded-full bg-yellow-400 items-center justify-center">
                <Text className="text-white font-extrabold">⇪</Text>
              </View>
              <Text className="text-gray-900 font-extrabold mt-3">
                Top Sharer
              </Text>
              <Text className="text-gray-400 text-xs text-center mt-1">
                Shared 50+
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl border border-gray-100 px-3 py-4 items-center opacity-40">
              <View className="h-14 w-14 rounded-full bg-gray-200" />
              <Text className="text-gray-900 font-extrabold mt-3">Locked</Text>
              <Text className="text-gray-400 text-xs text-center mt-1">
                Keep going
              </Text>
            </View>
          </View>
        </View>

        <View className="px-5 mt-7">
          <Text className="text-gray-900 font-extrabold">Recent Activity</Text>
          <View className="mt-4 gap-3">
            <View className="flex-row items-center bg-white rounded-2xl border border-gray-100 px-4 py-4">
              <View className="h-10 w-10 rounded-2xl bg-green-50 items-center justify-center">
                <Text className="text-green-700">🛒</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-900 font-extrabold">
                  Sold item in Marketplace
                </Text>
                <Text className="text-gray-400 text-xs mt-1">2 HOURS AGO</Text>
              </View>
            </View>
            <View className="flex-row items-center bg-white rounded-2xl border border-gray-100 px-4 py-4">
              <View className="h-10 w-10 rounded-2xl bg-green-50 items-center justify-center">
                <Text className="text-green-700">💬</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-900 font-extrabold">
                  Answered a query in Community
                </Text>
                <Text className="text-gray-400 text-xs mt-1">YESTERDAY</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
