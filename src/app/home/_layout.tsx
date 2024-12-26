import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack, Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'

import { tamaguiConfig } from '../../../tamagui.config'
import React from 'react'

export default function HomeLayout() {
  const colorScheme = useColorScheme()

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen name="index" options={{ headerShown: true,
            title: "Home"
           }} />
          <Stack.Screen name="user-profile" options={{ headerShown: true,
            title: "Profile"
           }} />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  )
}