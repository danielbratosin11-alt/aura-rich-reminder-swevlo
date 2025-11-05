
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(home)" />
    </Stack>
  );
}
