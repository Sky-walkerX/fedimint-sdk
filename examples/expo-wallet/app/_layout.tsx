import { Stack } from 'expo-router'
import { FedimintProvider } from '../src/providers/FedimintProvider'

export default function RootLayout() {
  return (
    <FedimintProvider>
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
    </FedimintProvider>
  )
}
