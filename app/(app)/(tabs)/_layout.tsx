import { TabBar } from '@/components/ui/tab-bar'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Tabs } from 'expo-router'
import { View } from 'react-native'

export default function TabsLayout() {
  return (
    <View className="flex-1 bg-[#F2F2F2]">
      <Tabs
        tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}
        screenOptions={{
          animation: 'shift',
          headerShown: false,
        }}
      >
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      </Tabs>
    </View>
  )
}
