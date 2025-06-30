import React from 'react'
import { HomeHeader } from '@/components/home-header'
import { Button } from '@/components/ui/button'
import { WeekActivityChart } from '@/components/week-activity-chart'
import { router, Stack } from 'expo-router'
import { Bike, Calendar } from 'lucide-react-native'
import { Text, View, ScrollView } from 'react-native'
import { useRides } from '@/contexts/rides-context'
import dayjs from 'dayjs'

// Type for file info analysis data
interface FileInfoWithDate {
  activityDate: string
  [key: string]: unknown
}

export default function Index() {
  const { state } = useRides()
  const { rides } = state
  const today = dayjs()

  // Motivational insights about rest days for cyclists
  const restDayInsights = [
    'Rest days are when your muscles rebuild stronger ',
    'Recovery is where the magic happens - your body adapts and grows',
    "Today's rest fuels tomorrow's performance 🚴‍♂️",
    'Smart cyclists know: rest days prevent burnout and injury',
    "Your body is repairing itself today - that's training too!",
  ]

  // Filter rides that happened today based on activityDate from analysis
  const todaysRides = rides.filter((ride) => {
    if (
      ride.analysis?.fileInfo &&
      typeof ride.analysis.fileInfo === 'object' &&
      'activityDate' in ride.analysis.fileInfo
    ) {
      const fileInfo = ride.analysis.fileInfo as FileInfoWithDate
      return dayjs(fileInfo.activityDate).isSame(today, 'day')
    }
    // Fallback to uploadDate if no analysis data
    return dayjs(ride.uploadDate).isSame(today, 'day')
  })

  // Get a random rest day insight
  const randomInsight =
    restDayInsights[Math.floor(Math.random() * restDayInsights.length)]

  return (
    <>
      <Stack.Screen
        name="index"
        options={{ headerShown: true, header: () => <HomeHeader /> }}
      />
      <ScrollView className="flex-1">
        <View className="p-4">
          <WeekActivityChart />

          <Button
            variant="secondary"
            className="rounded-full bg-selected flex-row items-center gap-2 mt-4"
            onPress={() => {
              router.push('/upload-file-info-modal')
            }}
          >
            <Bike className="text-white" size={14} />
            <Text className="text-white font-barlow-700">Add Ride</Text>
          </Button>

          {/* Today's Rides Section */}
          <View className="mb-6 mt-4">
            <Text className="text-xl font-barlow-700 mb-3">
              {today.format('dddd, MMMM D')}
            </Text>
            {todaysRides.length > 0 ? (
              <View className="space-y-2">
                {todaysRides.map((ride) => (
                  <View key={ride.id} className="bg-card  rounded-xl p-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="font-barlow-500 text-base">
                          {ride.name}
                        </Text>
                        <View className="flex-row items-center gap-2 mt-1">
                          <Calendar size={14} className="text-foreground/60" />
                          <Text className="text-sm text-foreground/60 font-barlow-400">
                            {ride.analysis?.fileInfo &&
                            typeof ride.analysis.fileInfo === 'object' &&
                            'activityDate' in ride.analysis.fileInfo
                              ? dayjs(
                                  (ride.analysis.fileInfo as FileInfoWithDate)
                                    .activityDate,
                                ).format('h:mm A')
                              : dayjs(ride.uploadDate).format('h:mm A')}
                          </Text>
                          <Text className="text-sm text-foreground/60 font-barlow-400">
                            • {(ride.fileSize / 1024).toFixed(1)} KB
                          </Text>
                        </View>
                      </View>
                      <View className="bg-selected/10 p-2 rounded-full">
                        <Bike className="text-selected" size={16} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-card rounded-xl p-6 items-center">
                <Bike className="text-foreground/40 mb-2" size={32} />
                <Text className="text-foreground/60 font-barlow-400 text-center">
                  {randomInsight}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  )
}
