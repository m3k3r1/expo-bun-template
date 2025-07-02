import { View, Text } from 'react-native'
import { Heart, TrendingUp } from 'lucide-react-native'
import type { HeartRateAnalysis } from '@/services/fit-file-parser'

interface HeartRateWidgetProps {
  heartRate: HeartRateAnalysis | null
}

export function HeartRateWidget({ heartRate }: HeartRateWidgetProps) {
  if (!heartRate) {
    return (
      <View className="bg-card rounded-xl p-4 opacity-50">
        <View className="flex-row items-center gap-2 mb-2">
          <Heart size={16} className="text-red-500" />
          <Text className="font-barlow-500 text-sm">Heart Rate</Text>
        </View>
        <Text className="text-xs text-foreground/60 font-barlow-400">
          No heart rate data
        </Text>
      </View>
    )
  }

  const getDriftColor = (drift: string) => {
    const driftValue = parseFloat(drift)
    if (driftValue > 5) return 'text-red-500'
    if (driftValue > 2) return 'text-orange-500'
    return 'text-green-500'
  }

  const getDriftLabel = (drift: string) => {
    const driftValue = parseFloat(drift)
    if (driftValue > 5) return 'High drift'
    if (driftValue > 2) return 'Moderate drift'
    return 'Low drift'
  }

  return (
    <View className="bg-card rounded-xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Heart size={16} className="text-red-500" />
          <Text className="font-barlow-500 text-sm">Heart Rate</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <TrendingUp size={12} className={getDriftColor(heartRate.drift)} />
          <Text
            className={`text-xs font-barlow-400 ${getDriftColor(heartRate.drift)}`}
          >
            {getDriftLabel(heartRate.drift)}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-3">
        <View className="flex-1">
          <Text className="text-xl font-barlow-700 text-red-500">
            {heartRate.avg}
          </Text>
          <Text className="text-xs text-foreground/60 font-barlow-400">
            Avg BPM
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-lg font-barlow-600 text-foreground/80">
            {heartRate.max}
          </Text>
          <Text className="text-xs text-foreground/60 font-barlow-400">
            Max BPM
          </Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-lg font-barlow-600 text-foreground/80">
            {heartRate.min}
          </Text>
          <Text className="text-xs text-foreground/60 font-barlow-400">
            Min BPM
          </Text>
        </View>
      </View>
    </View>
  )
}
