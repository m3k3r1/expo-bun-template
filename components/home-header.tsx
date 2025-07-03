import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'

export function HomeHeader() {
  return (
    <SafeAreaView>
      <View className="flex-row items-center justify-between px-4 py-3">
        {/* Left side - User Avatar */}
        <View className="flex-row items-center gap-3">
          <TouchableOpacity>
            <Image
              alt="User Avatar"
              style={{ width: 48, height: 48, borderRadius: 24 }}
              source={{ uri: 'https://github.com/m3k3r1.png' }}
            />
          </TouchableOpacity>
        </View>

        {/* Right side - Notification Icon */}
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <View className="relative">
            <Ionicons name="notifications" size={24} color="#000" />
            {/* Notification badge */}
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-[10px] text-white font-bold">3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
