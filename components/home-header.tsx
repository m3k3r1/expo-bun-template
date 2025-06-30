import { View, Text, SafeAreaView } from 'react-native'

export function HomeHeader() {
  return (
    <SafeAreaView className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2 px-4">
        <Text className="font-barlow-700 text-2xl dark:text-white">
          Domestiq
        </Text>
      </View>
    </SafeAreaView>
  )
}
