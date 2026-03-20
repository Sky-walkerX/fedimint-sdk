import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wallet Overview',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Transaction History',
        }}
      />
    </Tabs>
  )
}
