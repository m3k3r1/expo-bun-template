/* eslint-disable camelcase */
import '../global.css'
import '@/utils/cssinterop'

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import {
  Barlow_400Regular,
  Barlow_300Light,
  Barlow_500Medium,
  Barlow_700Bold,
  Barlow_900Black,
  useFonts,
} from '@expo-google-fonts/barlow'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import { RidesProvider } from '@/contexts/rides-context'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    Barlow_300Light,
    Barlow_400Regular,
    Barlow_500Medium,
    Barlow_700Bold,
    Barlow_900Black,
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <RidesProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Slot />
        <StatusBar style="dark" />
      </ThemeProvider>
    </RidesProvider>
  )
}
