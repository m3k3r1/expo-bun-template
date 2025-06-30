import { HomeHeader } from '@/components/home-header'
import { Button } from '@/components/ui/button'
import { WeekActivityChart } from '@/components/week-activity-chart'
import { Stack } from 'expo-router'
import { Bike } from 'lucide-react-native'
import { Text, View } from 'react-native'

export default function Index() {
  return (
    <>
      <Stack.Screen
        name="index"
        options={{ headerShown: true, header: () => <HomeHeader /> }}
      />
      <View className="flex-1 p-4">
        <WeekActivityChart />

        <Button
          variant="secondary"
          className="mt-4 rounded-full bg-selected flex-row items-center gap-2"
          onPress={() => {
            console.log('clicked')
          }}
        >
          <Bike className="text-white" size={14} />
          <Text className="text-white font-barlow-700">Add Ride</Text>
        </Button>
      </View>
    </>
  )
}
