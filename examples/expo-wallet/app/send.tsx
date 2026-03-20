import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { ActionButton } from '../src/components/ActionButton'
import { AppScreen } from '../src/components/AppScreen'
import { Panel } from '../src/components/Panel'
import { palette } from '../src/theme/palette'

export default function SendScreen() {
  const [invoiceInput, setInvoiceInput] = useState('')

  return (
    <AppScreen>
      <View style={styles.container}>
        <Text style={styles.heading}>Send Payment</Text>
        <Text style={styles.subheading}>
          Paste a Lightning invoice or federated payment address.
        </Text>

        <Panel>
          <Text style={styles.inputLabel}>Invoice or Address</Text>
          <TextInput
            multiline
            value={invoiceInput}
            onChangeText={setInvoiceInput}
            placeholder="lnbc..."
            placeholderTextColor={palette.textSecondary}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.actionStack}>
            <ActionButton
              label="Scan QR"
              variant="secondary"
              onPress={() => undefined}
              icon={
                <Feather name="camera" size={18} color={palette.textPrimary} />
              }
            />
            <ActionButton
              label="Review Payment"
              onPress={() => undefined}
              icon={<Feather name="arrow-up-right" size={18} color="#FFFFFF" />}
            />
          </View>
        </Panel>

        <Text style={styles.footerNote}>
          QR scanning and live payment parsing land in later steps.
        </Text>
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
  },
  heading: {
    color: palette.textPrimary,
    fontSize: 32,
    fontWeight: '700',
  },
  subheading: {
    color: palette.textSecondary,
    fontSize: 15,
  },
  inputLabel: {
    color: palette.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    minHeight: 120,
    backgroundColor: palette.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.inputBorder,
    color: palette.textPrimary,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  actionStack: {
    marginTop: 12,
    gap: 8,
  },
  footerNote: {
    color: palette.textSecondary,
    fontSize: 13,
  },
})
