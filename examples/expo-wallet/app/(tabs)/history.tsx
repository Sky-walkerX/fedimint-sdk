import { StyleSheet, Text, View } from 'react-native'

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Transaction History</Text>
      <Text style={styles.subheading}>
        History screen scaffolded for Step 2.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
  },
  subheading: {
    fontSize: 16,
    color: '#5f6368',
    textAlign: 'center',
  },
})
