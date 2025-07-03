import { View, StyleSheet, type LayoutChangeEvent } from 'react-native'

import { useTheme } from '@react-navigation/native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import {
  Cog,
  Home,
  LucideMessageCircleQuestion,
  MessageCircle,
} from 'lucide-react-native'
import { TabBarButtonAnimated } from './tab-bar-button-animated'
import { useEffect, useState } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme()
  const [dimensions, setDimensions] = useState<{
    width: number
    height: number
  }>({
    width: 100,
    height: 20,
  })

  const buttomWidth = dimensions.width / state.routes.length

  const onTabbarLayout = (event: LayoutChangeEvent) => {
    setDimensions({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    })
  }

  const tabPositionX = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    }
  })

  // Define tab bar icon rendering with proper types
  const tabBarIcon = (name: string, props: { size: number; color: string }) => {
    switch (name) {
      case 'home':
        return <Home {...props} />
      case 'insights':
        return <MessageCircle {...props} />
      case 'settings':
        return <Cog {...props} />
      default:
        return <LucideMessageCircleQuestion {...props} />
    }
  }

  useEffect(() => {
    tabPositionX.value = withSpring(buttomWidth * (state.index - 1), {
      duration: 1500,
    })
  }, [state.index, buttomWidth])

  return (
    <View style={styles.tabBar} onLayout={onTabbarLayout}>
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            backgroundColor: '#F25606',
            borderRadius: 30,
            height: dimensions.height - 15,
            width: buttomWidth - 12,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const isFocused = state.index === index

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name

        // Handle tab press navigation
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }

        // Handle long press navigation
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <TabBarButtonAnimated
            key={route.key}
            route={route}
            index={index}
            label={label as string}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            tabBarIcon={tabBarIcon}
            iconSize={24}
            iconColor={isFocused ? '#fff' : colors.text}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 80,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tabBarItem: {
    flex: 1,
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
