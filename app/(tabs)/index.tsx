import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View
} from 'react-native';

import {getEvents} from '../../src/features/events/api/events.api';
import {getMe} from '../../src/features/profile/api/profile.api';
import {useAppQuery} from '../../src/shared/api/query';

const CAMPUSES = [
  'All Campuses',
  'Main Campus',
  'North Campus',
  'South Campus'
];
const TYPES = ['FEATURED', 'ACADEMIC', 'SPORTS'];

function Chip({
  label,
  active,
  onPress
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={
        active
          ? 'px-4 py-2 rounded-full bg-green-500 mr-3'
          : 'px-4 py-2 rounded-full bg-gray-100 mr-3'
      }
    >
      <Text
        className={
          active ? 'text-white font-semibold' : 'text-gray-800 font-semibold'
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [campus, setCampus] = useState(CAMPUSES[0]);
  const [type, setType] = useState(TYPES[0]);
  const [search, setSearch] = useState('');

  const meQuery = useAppQuery({
    queryKey: ['profile', 'me'],
    queryFn: getMe
  });

  const eventsQuery = useAppQuery({
    queryKey: ['events', {campus, type}],
    queryFn: () =>
      getEvents({
        campus: campus === 'All Campuses' ? undefined : campus,
        type
      })
  });

  const filteredEvents = useMemo(() => {
    const items = eventsQuery.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(e => {
      const hay =
        `${e.title ?? ''} ${e.description ?? ''} ${e.location ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [eventsQuery.data, search]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="h-12 w-12 rounded-full bg-gray-200 border-2 border-green-500" />
            <View className="ml-3">
              <Text className="text-gray-500">Welcome back,</Text>
              <Text className="text-xl font-extrabold text-gray-900">
                {meQuery.data
                  ? `${meQuery.data.firstName} ${meQuery.data.lastName}`
                  : 'CampusLink Student'}
              </Text>
            </View>
          </View>
          <View className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center">
            <Text className="text-gray-700">{'🔔'}</Text>
          </View>
        </View>

        <View className="flex-row items-center mt-5">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">
            <Text className="text-gray-500 mr-2">{'🔍'}</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search events, orgs…"
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-gray-900"
            />
          </View>
          <Pressable className="ml-3 bg-green-500 h-12 w-12 rounded-2xl items-center justify-center">
            <Text className="text-white font-black">≡</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between mt-6">
          <Text className="text-gray-500 font-bold tracking-widest">
            SELECT CAMPUS
          </Text>
          <Text className="text-green-600 font-bold">
            {CAMPUSES.length - 1} Campuses
          </Text>
        </View>

        <View className="mt-3">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CAMPUSES}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <Chip
                label={item}
                active={item === campus}
                onPress={() => setCampus(item)}
              />
            )}
          />
        </View>

        <View className="mt-4">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={TYPES}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <Pressable
                onPress={() => setType(item)}
                className={
                  item === type
                    ? 'px-4 py-2 rounded-full border border-green-500 bg-green-50 mr-3'
                    : 'px-4 py-2 rounded-full bg-gray-100 mr-3'
                }
              >
                <Text
                  className={
                    item === type
                      ? 'text-green-700 font-extrabold'
                      : 'text-gray-800 font-bold'
                  }
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </View>

      <View className="flex-1 px-5 mt-4">
        {eventsQuery.isLoading ? (
          <Text className="text-gray-500">Loading events…</Text>
        ) : null}
        {eventsQuery.error ? (
          <Text className="text-red-600">Failed to load events.</Text>
        ) : null}

        <FlatList
          data={filteredEvents}
          keyExtractor={(item, idx) => item.id ?? String(idx)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 24}}
          renderItem={({item}) => (
            <View className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-5">
              <View className="px-4 pt-4 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="h-10 w-10 rounded-full bg-gray-200" />
                  <View className="ml-3">
                    <Text className="font-extrabold text-gray-900">
                      {item.organizerName ?? 'Campus Student Council'}
                    </Text>
                    <Text className="text-gray-500 text-xs">Organizer</Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <View className="bg-green-50 px-3 py-2 rounded-xl mr-2">
                    <Text className="text-green-700 font-extrabold">
                      +50 XP
                    </Text>
                  </View>
                  <View className="bg-gray-100 h-10 w-10 rounded-2xl items-center justify-center">
                    <Text className="text-gray-800 text-lg">+</Text>
                  </View>
                </View>
              </View>

              <View className="mx-4 mt-4 h-44 rounded-2xl bg-gray-200 overflow-hidden">
                <View className="absolute left-3 bottom-3 bg-green-500 px-3 py-1 rounded-full">
                  <Text className="text-white font-extrabold text-xs">
                    {(item.type ?? type).toUpperCase()}
                  </Text>
                </View>
                <View className="absolute right-3 top-3 bg-black/60 px-3 py-2 rounded-2xl">
                  <Text className="text-white font-extrabold">OCT</Text>
                  <Text className="text-white font-extrabold text-lg">24</Text>
                </View>
              </View>

              <View className="px-4 py-4">
                <Text className="text-xl font-extrabold text-gray-900">
                  {item.title ?? 'Tech Innovations Summit 2024'}
                </Text>
                <View className="flex-row items-center mt-2">
                  <Text className="text-gray-500">
                    {'📍'} {item.location ?? 'Main Hall'}
                  </Text>
                  <Text className="text-gray-400 mx-2">•</Text>
                  <Text className="text-gray-500">
                    {item.attendingCount ?? 1200} attending /{' '}
                    {item.slotsTotal ?? 2000} slots
                  </Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
                  <View className="h-2 bg-green-500" style={{width: '70%'}} />
                </View>

                <View className="flex-row items-center mt-4">
                  <Pressable className="flex-1 bg-green-500 py-4 rounded-2xl items-center">
                    <Text className="text-white font-extrabold">RSVP Now</Text>
                  </Pressable>
                  <Pressable className="ml-3 flex-1 bg-white py-4 rounded-2xl border border-gray-200 items-center">
                    <Text className="text-gray-900 font-extrabold">
                      Details
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
