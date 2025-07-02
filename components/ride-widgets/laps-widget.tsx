import { View, Text, ScrollView } from 'react-native'
import { Flag, Timer } from 'lucide-react-native'
import type { Lap } from '@/services/fit-file-parser'

interface LapsWidgetProps {
  laps: Lap[]
}

export function LapsWidget({ laps }: LapsWidgetProps) {
  if (!laps || laps.length === 0) {
    return (
      <View className="bg-card rounded-xl p-4 opacity-50">
        <View className="flex-row items-center gap-2 mb-2">
          <Flag size={16} className="text-green-500" />
          <Text className="font-barlow-500 text-sm">Laps</Text>
        </View>
        <Text className="text-xs text-foreground/60 font-barlow-400">
          No lap data
        </Text>
      </View>
    )
  }

  const formatTime = (timeInSeconds?: number) => {
    if (!timeInSeconds) return '0:00'
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return '0.0'
    return (distance / 1000).toFixed(1)
  }

  const formatSpeed = (speed?: number) => {
    if (!speed) return '0.0'
    return speed.toFixed(1)
  }

  // Show max 3 laps to keep widget compact
  const displayLaps = laps.slice(0, 3)

  return (
    <View className="bg-card rounded-xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Flag size={16} className="text-green-500" />
          <Text className="font-barlow-500 text-sm">Laps</Text>
        </View>
        <Text className="text-xs text-foreground/60 font-barlow-400">
          {laps.length} total
        </Text>
      </View>

      {/* Lap Summary */}
      <View className="mb-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-barlow-700 text-green-500">
            {laps.length}
          </Text>
          <View className="flex-row gap-4">
            <View className="items-center">
              <Text className="text-sm font-barlow-500 text-foreground/80">
                {formatDistance(laps.reduce((sum, lap) => sum + (lap.total_distance || 0), 0))}
              </Text>
              <Text className="text-xs text-foreground/60 font-barlow-400">
                km total
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-sm font-barlow-500 text-foreground/80">
                {formatTime(laps.reduce((sum, lap) => sum + (lap.total_elapsed_time || 0), 0) / laps.length)}
              </Text>
              <Text className="text-xs text-foreground/60 font-barlow-400">
                avg time
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Individual Laps */}
      <ScrollView className="max-h-32" showsVerticalScrollIndicator={false}>
        {displayLaps.map((lap, index) => (
          <View key={index} className="flex-row justify-between items-center py-2 border-b border-border/50 last:border-b-0">
            <View className="flex-row items-center gap-2">
              <View className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center">
                <Text className="text-xs font-barlow-600 text-green-600">
                  {index + 1}
                </Text>
              </View>
              <View>
                <Text className="text-sm font-barlow-500">
                  {formatDistance(lap.total_distance)} km
                </Text>
                <Text className="text-xs text-foreground/60 font-barlow-400">
                  {formatSpeed(lap.avg_speed)} km/h avg
                </Text>
              </View>
            </View>
            <View className="items-end">
              <View className="flex-row items-center gap-1">
                <Timer size={10} className="text-foreground/60" />
                <Text className="text-sm font-barlow-500">
                  {formatTime(lap.total_elapsed_time)}
                </Text>
              </View>
              {lap.avg_heart_rate && (
                <Text className="text-xs text-foreground/60 font-barlow-400">
                  ♥ {Math.round(lap.avg_heart_rate)} bpm
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {laps.length > 3 && (
        <Text className="text-xs text-center text-foreground/60 font-barlow-400 mt-2">
          +{laps.length - 3} more laps
        </Text>
      )}
    </View>
  )
}