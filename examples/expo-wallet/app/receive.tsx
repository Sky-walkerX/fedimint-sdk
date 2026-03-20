import { Feather } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { ActionButton } from '../src/components/ActionButton'
import { AppScreen } from '../src/components/AppScreen'
import { Panel } from '../src/components/Panel'
import { toMockInvoice } from '../src/mocks/wallet'
import { palette } from '../src/theme/palette'

export default function ReceiveScreen() {
  const [amountInput, setAmountInput] = useState('21000')

  const amountSats = Number.parseInt(amountInput, 10)
  const safeAmountSats =
    Number.isFinite(amountSats) && amountSats > 0 ? amountSats : 0

  const mockInvoice = useMemo(() => {
    return toMockInvoice(safeAmountSats)
  }, [safeAmountSats])

  return (
    <AppScreen>
      <View style={styles.container}>
        <Text style={styles.heading}>Receive Funds</Text>
        <Text style={styles.subheading}>
          Create an invoice and share the QR.
        </Text>

        <Panel>
          <Text style={styles.inputLabel}>Amount (sats)</Text>
          <TextInput
            value={amountInput}
            onChangeText={setAmountInput}
            placeholder="21000"
            placeholderTextColor={palette.textSecondary}
            style={styles.input}
            keyboardType="number-pad"
          />

          <View style={styles.qrPlaceholder}>
            <Feather name="grid" size={70} color={palette.tabInactive} />
            <Text style={styles.qrPlaceholderText}>QR placeholder</Text>
          </View>

          <Text style={styles.invoiceLabel}>Generated Invoice (mock)</Text>
          <Text numberOfLines={2} style={styles.invoiceText}>
            {mockInvoice}
          </Text>

          <View style={styles.actionStack}>
            <ActionButton
              label="Generate Invoice"
              onPress={() => undefined}
              icon={<Feather name="plus-circle" size={18} color="#FFFFFF" />}
            />
          </View>
        </Panel>
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
    height: 50,
    backgroundColor: palette.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.inputBorder,
    color: palette.textPrimary,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  qrPlaceholder: {
    marginTop: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: palette.inputBorder,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 10,
    backgroundColor: palette.inputBg,
  },
  qrPlaceholderText: {
    color: palette.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  invoiceLabel: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  invoiceText: {
    color: palette.textPrimary,
    fontSize: 14,
    marginTop: 4,
  },
  actionStack: {
    marginTop: 14,
  },
})
