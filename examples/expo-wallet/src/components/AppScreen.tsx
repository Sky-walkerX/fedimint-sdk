import type { ReactNode } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { palette } from '../theme/palette'

type AppScreenProps = {
  children: ReactNode
}

export function AppScreen({ children }: AppScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.blobOne} />
      <View style={styles.blobTwo} />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.bgBase,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  blobOne: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 160,
    backgroundColor: palette.bgBlobOne,
    opacity: 0.33,
    top: -90,
    right: -70,
  },
  blobTwo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 150,
    backgroundColor: palette.bgBlobTwo,
    opacity: 0.2,
    bottom: -80,
    left: -80,
  },
})
