import React, { useEffect, useState } from 'react'
import { HomeHeader } from '@/components/home-header'
import { Button } from '@/components/ui/button'
import { WeekActivityChart } from '@/components/week-activity-chart'
import { router, Stack } from 'expo-router'
import { Bike, Heart, Activity, Zap } from 'lucide-react-native'
import { Text, View, ScrollView } from 'react-native'
import { useRides } from '@/contexts/rides-context'
import dayjs from 'dayjs'
import { HeartRateWidget } from '@/components/ride-widgets/heart-rate-widget'
import { DistanceWidget } from '@/components/ride-widgets/distance-widget'
import { LapsWidget } from '@/components/ride-widgets/laps-widget'
import ExpoHealthSleepModule from '@/modules/expo-health-sleep'
import {
  EnhancedSleepSummary,
  BreathingDisturbances,
} from '@/modules/expo-health-sleep/src/ExpoHealthSleep.types'

// Type for file info analysis data
interface FileInfoWithDate {
  activityDate: string
  [key: string]: unknown
}

export default function Index() {
  const { state } = useRides()
  const { rides } = state
  const today = dayjs()
  const [sleepData, setSleepData] = useState<EnhancedSleepSummary | null>(null)
  const [breathingData, setBreathingData] =
    useState<BreathingDisturbances | null>(null)
  const [sleepError, setSleepError] = useState<string | null>(null)
  const [isLoadingEnhanced, setIsLoadingEnhanced] = useState(false)

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        setIsLoadingEnhanced(true)
        if (ExpoHealthSleepModule.isHealthKitAvailable()) {
          const authorized = await ExpoHealthSleepModule.requestAuthorization()
          if (authorized) {
            const todayISO = today.format('YYYY-MM-DDTHH:mm:ssZZ')
            console.log('Fetching enhanced sleep data for date:', todayISO)

            // Try to get enhanced sleep summary first (iOS 18+ features)
            try {
              const enhancedSummary =
                await ExpoHealthSleepModule.getEnhancedSleepSummary(todayISO)
              setSleepData(enhancedSummary)
              console.log('Enhanced sleep data for today:', enhancedSummary)

              // Also get breathing disturbances data
              const yesterdayISO = today
                .subtract(1, 'day')
                .format('YYYY-MM-DDTHH:mm:ssZZ')
              const breathingDisturbances =
                await ExpoHealthSleepModule.getBreathingDisturbances(
                  yesterdayISO,
                  todayISO,
                )
              setBreathingData(breathingDisturbances)
              console.log('Breathing disturbances:', breathingDisturbances)
            } catch (enhancedError) {
              console.log(
                'Enhanced features not available, falling back to basic sleep data',
              )
              // Fallback to basic sleep summary
              const basicSummary =
                await ExpoHealthSleepModule.getSleepSummary(todayISO)
              setSleepData({
                ...basicSummary,
                sleepQualityMetrics: {
                  remPercentage:
                    basicSummary.totalSleepTime > 0
                      ? (basicSummary.remSleepTime /
                          basicSummary.totalSleepTime) *
                        100
                      : 0,
                  deepPercentage:
                    basicSummary.totalSleepTime > 0
                      ? (basicSummary.deepSleepTime /
                          basicSummary.totalSleepTime) *
                        100
                      : 0,
                  corePercentage:
                    basicSummary.totalSleepTime > 0
                      ? (basicSummary.coreSleepTime /
                          basicSummary.totalSleepTime) *
                        100
                      : 0,
                },
                vitals: {
                  averageHeartRate: 0,
                  heartRateVariability: 0,
                  averageRespiratoryRate: 0,
                  respiratoryVariability: 0,
                },
                sleepHealthScore: 0,
              } as EnhancedSleepSummary)
            }
          } else {
            setSleepError('HealthKit authorization denied')
          }
        } else {
          setSleepError('HealthKit not available')
        }
      } catch (error) {
        console.error('Sleep data fetch error:', error)
        setSleepError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setIsLoadingEnhanced(false)
      }
    }

    fetchSleepData()
  }, [])

  // Motivational insights about rest days for cyclists
  const restDayInsights = [
    'Rest days are when your muscles rebuild stronger 💪',
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

          {/* Enhanced Sleep Recovery Section */}
          <View className="mb-4">
            <Text className="text-lg font-barlow-700 mb-3">
              Sleep Recovery{' '}
              {(sleepData?.vitals?.averageHeartRate ?? 0) > 0 && '✨'}
            </Text>
            {sleepError ? (
              <View className="bg-destructive/10 rounded-xl p-4">
                <Text className="text-destructive font-barlow-400">
                  {sleepError}
                </Text>
              </View>
            ) : sleepData ? (
              <View className="space-y-3">
                {/* Main Sleep Stats */}
                <View className="bg-card rounded-xl p-4 space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-foreground/60 font-barlow-400">
                      Total Sleep
                    </Text>
                    <Text className="font-barlow-500">
                      {Math.round(sleepData.totalSleepTime / 3600)}h{' '}
                      {Math.round((sleepData.totalSleepTime % 3600) / 60)}m
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-foreground/60 font-barlow-400">
                      Sleep Efficiency
                    </Text>
                    <Text className="font-barlow-500">
                      {Math.round(sleepData.sleepEfficiency)}%
                    </Text>
                  </View>

                  {/* Sleep Health Score (iOS 18+ feature) */}
                  {sleepData.sleepHealthScore > 0 && (
                    <View className="flex-row justify-between">
                      <Text className="text-foreground/60 font-barlow-400 flex-row items-center">
                        <Zap size={12} className="text-foreground/60 mr-1" />
                        Sleep Health Score
                      </Text>
                      <Text className="font-barlow-500 text-green-400">
                        {Math.round(sleepData.sleepHealthScore)}/100
                      </Text>
                    </View>
                  )}
                </View>

                {/* Sleep Stages */}
                <View className="bg-card rounded-xl p-4 space-y-2">
                  <Text className="font-barlow-600 mb-2">Sleep Stages</Text>
                  {sleepData.remSleepTime > 0 && (
                    <View className="flex-row justify-between">
                      <Text className="text-foreground/60 font-barlow-400">
                        REM Sleep (
                        {Math.round(
                          sleepData.sleepQualityMetrics?.remPercentage ?? 0,
                        )}
                        %)
                      </Text>
                      <Text className="font-barlow-500">
                        {Math.round(sleepData.remSleepTime / 3600)}h{' '}
                        {Math.round((sleepData.remSleepTime % 3600) / 60)}m
                      </Text>
                    </View>
                  )}
                  {sleepData.deepSleepTime > 0 && (
                    <View className="flex-row justify-between">
                      <Text className="text-foreground/60 font-barlow-400">
                        Deep Sleep (
                        {Math.round(
                          sleepData.sleepQualityMetrics?.deepPercentage ?? 0,
                        )}
                        %)
                      </Text>
                      <Text className="font-barlow-500">
                        {Math.round(sleepData.deepSleepTime / 3600)}h{' '}
                        {Math.round((sleepData.deepSleepTime % 3600) / 60)}m
                      </Text>
                    </View>
                  )}
                  {sleepData.coreSleepTime > 0 && (
                    <View className="flex-row justify-between">
                      <Text className="text-foreground/60 font-barlow-400">
                        Core Sleep (
                        {Math.round(
                          sleepData.sleepQualityMetrics?.corePercentage ?? 0,
                        )}
                        %)
                      </Text>
                      <Text className="font-barlow-500">
                        {Math.round(sleepData.coreSleepTime / 3600)}h{' '}
                        {Math.round((sleepData.coreSleepTime % 3600) / 60)}m
                      </Text>
                    </View>
                  )}
                </View>

                {/* Vitals During Sleep (iOS 18+ feature) */}
                {sleepData.vitals?.averageHeartRate > 0 && (
                  <View className="bg-card rounded-xl p-4 space-y-2">
                    <Text className="font-barlow-600 mb-2 flex-row items-center">
                      <Heart size={14} className="text-red-400 mr-2" />
                      Sleep Vitals
                    </Text>
                    <View className="flex-row justify-between">
                      <Text className="text-foreground/60 font-barlow-400">
                        Avg Heart Rate
                      </Text>
                      <Text className="font-barlow-500">
                        {Math.round(sleepData.vitals?.averageHeartRate ?? 0)}{' '}
                        bpm
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-foreground/60 font-barlow-400">
                        Respiratory Rate
                      </Text>
                      <Text className="font-barlow-500">
                        {Math.round(
                          sleepData.vitals?.averageRespiratoryRate ?? 0,
                        )}{' '}
                        /min
                      </Text>
                    </View>
                  </View>
                )}

                {/* Breathing Disturbances (watchOS 11+ feature) */}
                {breathingData && breathingData.respiratoryData.average > 0 && (
                  <View className="bg-card rounded-xl p-4 space-y-2">
                    <Text className="font-barlow-600 mb-2 flex-row items-center">
                      <Activity size={14} className="text-blue-400 mr-2" />
                      Breathing Quality
                    </Text>
                    <View className="flex-row justify-between">
                      <Text className="text-foreground/60 font-barlow-400">
                        Respiratory Variability
                      </Text>
                      <Text className="font-barlow-500">
                        {Math.round(
                          breathingData.respiratoryData.variability * 10,
                        ) / 10}
                      </Text>
                    </View>
                    <Text className="text-xs text-foreground/40 font-barlow-400 mt-2">
                      {breathingData.note}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View className="bg-card rounded-xl p-4">
                <Text className="text-foreground/60 font-barlow-400">
                  {isLoadingEnhanced
                    ? 'Loading enhanced sleep data...'
                    : 'Loading sleep data...'}
                </Text>
              </View>
            )}
          </View>

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
