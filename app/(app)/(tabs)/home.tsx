import React from 'react'
import { Stack } from 'expo-router'
import { View, Text } from 'react-native'
import { HomeHeader } from '../../../components/home-header'
import { WeekActivityChart } from '@/components/week-activity-chart'

export default function Home() {
  // Get current date
  const today = new Date()
  const day = today.getDate()
  const month = today.toLocaleDateString('en-US', { month: 'long' })

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <HomeHeader />,
        }}
      />
      <View className="flex-1 px-4 pt-4">
        {/* Today Header Section */}
        <View className="mb-6">
          <Text className="text-5xl font-barlow-700 text-black dark:text-white leading-none">
            Today
          </Text>
          <Text className="text-4xl font-barlow-400 text-black dark:text-white mt-1 px-2 leading-none">
            {day} {month}
          </Text>
        </View>

        {/* Activity Chart */}
        <WeekActivityChart />
      </View>
    </>
  )
}
