import React, { useEffect } from 'react'
import { HomeHeader } from '@/components/home-header'
import { Button } from '@/components/ui/button'
import { WeekActivityChart } from '@/components/week-activity-chart'
import { router, Stack } from 'expo-router'
import { Bike } from 'lucide-react-native'
import { Text, View, ScrollView } from 'react-native'
import { useRides } from '@/contexts/rides-context'
import dayjs from 'dayjs'
import { HeartRateWidget } from '@/components/ride-widgets/heart-rate-widget'
import { DistanceWidget } from '@/components/ride-widgets/distance-widget'
import { LapsWidget } from '@/components/ride-widgets/laps-widget'
import ExpoHealthSleepModule from '@/modules/expo-health-sleep'

// Type for file info analysis data
interface FileInfoWithDate {
  activityDate: string
  [key: string]: unknown
}

export default function Index() {
  const { state } = useRides()
  const { rides } = state
  const today = dayjs()

  useEffect(() => {
    console.log('ExpoHealthSleepModule', ExpoHealthSleepModule.hello())
  }, [])

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
              <View className="space-y-4">
                {todaysRides.map((ride) => (
                  <View key={ride.id} className="space-y-3">
                    {/* Widget Grid */}
                    <View className="space-y-3 gap-4">
                      <DistanceWidget session={ride.analysis?.session} />
                      <HeartRateWidget
                        heartRate={ride.analysis?.heartRate || null}
                      />
                      <LapsWidget laps={ride.analysis?.laps || []} />
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
