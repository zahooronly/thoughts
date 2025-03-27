import { useSharedValue, withSpring, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export function useHomeAnimations() {
  const headerScale = useSharedValue(1);
  const rotateAnimation = useSharedValue(0);

  const handleHeaderScale = () => {
    headerScale.value = withSequence(
      withTiming(0.97, { duration: 150 }),
      withSpring(1, { damping: 12 })
    );
  };

  const handleRotateAnimation = () => {
    rotateAnimation.value = withSequence(
      withTiming(360, { duration: 1000 }),
      withTiming(0, { duration: 0 })
    );
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(headerScale.value) }],
  }));

  const reloadIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnimation.value}deg` }],
  }));

  return {
    headerScale,
    rotateAnimation,
    handleHeaderScale,
    handleRotateAnimation,
    headerAnimatedStyle,
    reloadIconStyle,
  };
}