import { Link } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

export default function OverviewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Wallet Overview</Text>
      <Text style={styles.subheading}>
        Step 1 navigation scaffold is ready.
      </Text>

      <View style={styles.actions}>
        <Link href="/send" style={styles.actionLink}>
          Open Send
        </Link>
        <Link href="/receive" style={styles.actionLink}>
          Open Receive
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
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
  actions: {
    marginTop: 20,
    width: '100%',
    gap: 10,
  },
  actionLink: {
    borderRadius: 10,
    backgroundColor: '#1f2937',
    color: '#ffffff',
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
  },
})
