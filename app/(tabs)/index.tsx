import {router} from 'expo-router';
import {Pressable, Text, View} from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-xl font-bold text-gray-800 mb-2">
        Home (Events)
      </Text>
      <Text className="text-gray-500 mb-6">
        Coming next: events feed + filters + RSVP.
      </Text>

      <Pressable
        className="bg-blue-500 px-4 py-2 rounded-lg"
        onPress={() => router.push('/(tabs)/profile')}
      >
        <Text className="text-white font-semibold">Open Profile</Text>
      </Pressable>
    </View>
  );
}
