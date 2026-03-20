import type { ReactNode } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { palette } from '../theme/palette'

type PanelProps = {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}

export function Panel({ children, style }: PanelProps) {
  return <View style={[styles.panel, style]}>{children}</View>
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: palette.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.cardBorder,
    padding: 16,
    shadowColor: '#B77A3D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
})
