
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

interface TabButtonProps {
  tab: TabBarItem;
  isActive: boolean;
  onPress: (route: string) => void;
}

function TabButton({ tab, isActive, onPress }: TabButtonProps) {
  const scale = useSharedValue(isActive ? 1 : 0.9);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value) }],
    };
  });

  React.useEffect(() => {
    scale.value = isActive ? 1 : 0.9;
  }, [isActive, scale]);

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={() => onPress(tab.route)}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <IconSymbol
          name={tab.icon as any}
          size={24}
          color={isActive ? '#D4AF37' : '#C9A961'}
        />
        <Text
          style={[
            styles.tabLabel,
            {
              color: isActive ? '#D4AF37' : '#C9A961',
              fontWeight: isActive ? '600' : '400',
            },
          ]}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
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
    console.log('Tab pressed:', route);
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
          },
          Platform.select({
            ios: {
              shadowColor: '#D4AF37',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 15,
            },
            android: {
              elevation: 10,
            },
          }),
        ]}
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.route}
            tab={tab}
            isActive={isActive(tab.route)}
            onPress={handleTabPress}
          />
        ))}
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
