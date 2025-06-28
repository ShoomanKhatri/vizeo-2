import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

export const usePressableAnimation = (onPressCallback: () => void) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const onPressIn = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);

  const onPressOut = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);

  const animatedStyle = {
    backgroundColor: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["transparent", "rgba(255, 255, 255, 0.05)"],
    }),
  };

  return {
    onPressIn,
    onPressOut,
    onPress: onPressCallback,
    animatedStyle,
  };
};