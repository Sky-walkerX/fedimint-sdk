import { StyleSheet, Text, View } from 'react-native'

export default function ReceiveScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Receive</Text>
      <Text style={styles.subheading}>Modal route ready for receive flow.</Text>
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
