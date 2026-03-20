import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="send"
        options={{ presentation: 'modal', title: 'Send' }}
      />
      <Stack.Screen
        name="receive"
        options={{ presentation: 'modal', title: 'Receive' }}
      />
    </Stack>
  )
}
