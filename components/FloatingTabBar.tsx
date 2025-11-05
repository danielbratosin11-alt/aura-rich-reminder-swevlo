
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { BlurView } from 'expo-blur';

export interface TabBarItem {
  route: string;
  label: string;
  icon: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 40,
  borderRadius = 25,
  bottomMargin = 20,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const isActive = (route: string) => {
    if (route === '/(home)') {
      return pathname === '/' || pathname.startsWith('/(home)');
    }
    return pathname === route || pathname.startsWith(route);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { marginBottom: bottomMargin }]}
      edges={['bottom']}
    >
      <BlurView
        intensity={80}
        tint="dark"
        style={[
          styles.container,
          {
            width: containerWidth,
            borderRadius: borderRadius,
            backgroundColor: 'rgba(10, 10, 10, 0.8)',
            borderWidth: 1,
            borderColor: '#D4AF37',
            boxShadow: '0px 8px 30px rgba(212, 175, 55, 0.3)',
            elevation: 10,
          },
        ]}
      >
        {tabs.map((tab, index) => {
          const active = isActive(tab.route);
          const scale = useSharedValue(active ? 1 : 0.9);

          const animatedStyle = useAnimatedStyle(() => {
            return {
              transform: [{ scale: withSpring(scale.value) }],
            };
          });

          React.useEffect(() => {
            scale.value = active ? 1 : 0.9;
          }, [active]);

          return (
            <TouchableOpacity
              key={tab.route}
              style={styles.tab}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <Animated.View style={[styles.tabContent, animatedStyle]}>
                <IconSymbol
                  name={tab.icon as any}
                  size={24}
                  color={active ? '#D4AF37' : '#C9A961'}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: active ? '#D4AF37' : '#C9A961',
                      fontWeight: active ? '600' : '400',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
