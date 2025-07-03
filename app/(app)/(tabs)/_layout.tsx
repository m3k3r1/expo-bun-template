import { TabBar } from '@/components/ui/tab-bar'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}
      screenOptions={{
        animation: 'shift',
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  )
}
