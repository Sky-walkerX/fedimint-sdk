import type { ReactNode } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { palette } from '../theme/palette'

type ActionButtonProps = {
  label: string
  variant?: 'primary' | 'secondary'
  onPress: () => void
  icon?: ReactNode
}

export function ActionButton({
  label,
  variant = 'primary',
  onPress,
  icon,
}: ActionButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed &&
          (isPrimary ? styles.primaryPressed : styles.secondaryPressed),
      ]}
    >
      {icon}
      <Text
        style={[
          styles.label,
          isPrimary ? styles.primaryLabel : styles.secondaryLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: palette.brand,
  },
  secondary: {
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.inputBorder,
  },
  primaryPressed: {
    backgroundColor: palette.brandPressed,
  },
  secondaryPressed: {
    backgroundColor: palette.bgAccent,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: palette.textPrimary,
  },
})
