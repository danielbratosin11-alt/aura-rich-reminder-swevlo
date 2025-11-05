
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { Platform } from 'react-native';
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      route: '/(home)',
      label: 'Aura',
      icon: 'sparkles',
    },
    {
      route: '/profile',
      label: 'Profile',
      icon: 'person.circle',
    },
  ];

  if (Platform.OS === 'ios') {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(home)" />
          <Stack.Screen name="profile" />
        </Stack>
        <FloatingTabBar tabs={tabs} />
      </>
    );
  }

  return (
    <NativeTabs>
      <NativeTabs.Screen
        name="(home)"
        options={{
          title: 'Aura',
          tabBarIcon: ({ color }) => <Icon name="sparkles" color={color} />,
          tabBarLabel: ({ color }) => <Label color={color}>Aura</Label>,
        }}
      />
      <NativeTabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="person.circle" color={color} />,
          tabBarLabel: ({ color }) => <Label color={color}>Profile</Label>,
        }}
      />
    </NativeTabs>
  );
}
