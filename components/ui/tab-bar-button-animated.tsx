import { StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { PlatformPressable } from '@react-navigation/elements'
import { Route, useLinkBuilder } from '@react-navigation/native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useEffect } from 'react'

// Define proper types for the component props
interface TabBarButtonAnimatedProps {
  route: Route<string>
  index: number
  isFocused: boolean
  label: string
  onPress: () => void
  onLongPress: () => void
  tabBarIcon: (
    name: string,
    props: { size: number; color: string },
  ) => React.ReactNode
  iconSize: number
  iconColor: string
  accessibilityLabel?: string
  testID?: string
}

export function TabBarButtonAnimated({
  route,
  isFocused,
  onPress,
  onLongPress,
  label,
  tabBarIcon,
  iconSize,
  iconColor,
  accessibilityLabel,
  testID,
}: TabBarButtonAnimatedProps) {
  const scale = useSharedValue(0)
  const { buildHref } = useLinkBuilder()

  // Handle haptic feedback on press
  const handlePressIn = () => {
    if (process.env.EXPO_OS === 'ios') {
      // Add a soft haptic feedback when pressing down on the tabs
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, {
      duration: 350,
    })
  }, [scale, isFocused])

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0])
    return {
      opacity,
    }
  })

  const animatedStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2])
    const translateY = interpolate(scale.value, [0, 1], [0, 9])
    return {
      transform: [{ scale: scaleValue }, { translateY }],
    }
  })

  return (
    <PlatformPressable
      key={route.key}
      href={buildHref(route.name, route.params)}
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      style={styles.tabBarItem}
    >
      <Animated.View style={animatedStyle}>
        {tabBarIcon(route.name, {
          size: iconSize,
          color: iconColor,
        })}
      </Animated.View>
      <Animated.Text
        style={[
          animatedTextStyle,
          { color: iconColor, fontSize: 12, fontFamily: 'Barlow_500Medium' },
        ]}
      >
        {label}
      </Animated.Text>
    </PlatformPressable>
  )
}

const styles = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
