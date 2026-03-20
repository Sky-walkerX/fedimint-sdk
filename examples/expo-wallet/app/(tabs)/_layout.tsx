import { Feather } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { palette } from '../../src/theme/palette'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: palette.bgBase,
        },
        headerTitleStyle: {
          color: palette.textPrimary,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: palette.card,
          borderTopColor: palette.cardBorder,
        },
        tabBarActiveTintColor: palette.tabActive,
        tabBarInactiveTintColor: palette.tabInactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wallet Overview',
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="home" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Transaction History',
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="clock" size={size} />
          ),
        }}
      />
    </Tabs>
  )
}
