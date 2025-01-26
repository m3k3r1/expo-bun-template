import { Star } from 'lucide-react-native'
import { Text, View } from 'react-native'

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <View className="flex-row items-center gap-2 justify-center">
        <Star className="stroke-black" size={14} />
        <Text className="font-barlow-500">Expo Template</Text>
      </View>
    </View>
  )
}
