import React from 'react';
import { Text, View } from 'react-native';

export default function LostFoundScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-xl font-bold text-gray-900">Lost & Found</Text>
      <Text className="text-gray-500 mt-2">Coming next: list + create + retrieve.</Text>
    </View>
  );
}
