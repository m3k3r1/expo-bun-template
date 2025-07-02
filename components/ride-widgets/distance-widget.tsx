import { View, Text } from 'react-native'
import { MapPin, Clock, Gauge } from 'lucide-react-native'
import type { Session } from '@/services/fit-file-parser'

interface DistanceWidgetProps {
  session: Session | unknown
}

export function DistanceWidget({ session }: DistanceWidgetProps) {
  const sessionData = session as Session

  if (!sessionData?.total_distance && !sessionData?.total_elapsed_time) {
    return (
      <View className="bg-card rounded-xl p-4 opacity-50">
        <View className="flex-row items-center gap-2 mb-2">
          <MapPin size={16} className="text-blue-500" />
          <Text className="font-barlow-500 text-sm">Distance & Time</Text>
        </View>
        <Text className="text-xs text-foreground/60 font-barlow-400">
          No distance data
        </Text>
      </View>
    )
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return '0.0'
    return (distance / 1000).toFixed(1) // Convert meters to km
  }

  const formatTime = (timeInSeconds?: number) => {
    if (!timeInSeconds) return '0:00'
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}`
      : `${minutes}:${Math.floor(timeInSeconds % 60)
          .toString()
          .padStart(2, '0')}`
  }

  const formatSpeed = (speed?: number) => {
    if (!speed) return '0.0'
    return speed.toFixed(1)
  }

  return (
    <View className="bg-card rounded-xl p-4">
      <View className="flex-row items-center gap-2 mb-3">
        <MapPin size={16} className="text-blue-500" />
        <Text className="font-barlow-500 text-sm">Distance & Time</Text>
      </View>

      <View className="flex-row justify-between mb-3">
        <View className="flex-1">
          <Text className="text-xl font-barlow-700 text-blue-500">
            {formatDistance(sessionData.total_distance)}
          </Text>
          <Text className="text-xs text-foreground/60 font-barlow-400">km</Text>
        </View>
        <View className="flex-1 items-center">
          <View className="flex-row items-center gap-1">
            <Clock size={12} className="text-foreground/60" />
            <Text className="text-lg font-barlow-600 text-foreground/80">
              {formatTime(sessionData.total_elapsed_time)}
            </Text>
          </View>
          <Text className="text-xs text-foreground/60 font-barlow-400">
            Duration
          </Text>
        </View>
        <View className="flex-1 items-end">
          <View className="flex-row items-center gap-1">
            <Gauge size={12} className="text-foreground/60" />
            <Text className="text-lg font-barlow-600 text-foreground/80">
              {formatSpeed(sessionData.avg_speed)}
            </Text>
          </View>
          <Text className="text-xs text-foreground/60 font-barlow-400">
            km/h avg
          </Text>
        </View>
      </View>

      {/* Max Speed and Elevation */}
      <View className="flex-row justify-between mt-2 pt-2 border-t border-border">
        {sessionData.max_speed && (
          <View>
            <Text className="text-sm font-barlow-500 text-foreground/80">
              {formatSpeed(sessionData.max_speed)} km/h
            </Text>
            <Text className="text-xs text-foreground/60 font-barlow-400">
              Max Speed
            </Text>
          </View>
        )}
        {(sessionData.total_ascent || sessionData.total_descent) && (
          <View className="items-end">
            <Text className="text-sm font-barlow-500 text-foreground/80">
              ↗{Math.round(sessionData.total_ascent || 0)}m ↘
              {Math.round(sessionData.total_descent || 0)}m
            </Text>
            <Text className="text-xs text-foreground/60 font-barlow-400">
              Elevation
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}
