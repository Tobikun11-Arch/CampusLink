import {View, Text, Pressable} from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-xl font-bold text-gray-800 mb-4">
        Welcome to the Home Screen
      </Text>

      <Pressable
        className="bg-blue-500 px-4 py-2 rounded-lg"
        onPress={() => navigation.navigate('Profile')}
      >
        <Text className="text-white font-semibold">Go to Profile</Text>
      </Pressable>
    </View>
  );
}