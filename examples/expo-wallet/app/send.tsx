import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { ActionButton } from '../src/components/ActionButton'
import { AppScreen } from '../src/components/AppScreen'
import { useFedimint } from '../src/hooks/useFedimint'
import { Panel } from '../src/components/Panel'
import { palette } from '../src/theme/palette'

export default function SendScreen() {
  const { director, wallet } = useFedimint()
  const [invoiceInput, setInvoiceInput] = useState('')
  const [parseResult, setParseResult] = useState<{
    amount?: number
    expiry?: number
    memo?: string
  } | null>(null)
  const [paymentOperationId, setPaymentOperationId] = useState<string | null>(
    null,
  )
  const [screenError, setScreenError] = useState<string | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isPaying, setIsPaying] = useState(false)

  const handleParseInvoice = async () => {
    if (!director || !invoiceInput.trim()) {
      return
    }

    setIsParsing(true)
    setScreenError(null)
    setParseResult(null)

    try {
      const parsed = await director.parseBolt11Invoice(invoiceInput.trim())
      setParseResult(parsed)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to parse invoice'
      setScreenError(message)
    } finally {
      setIsParsing(false)
    }
  }

  const handlePayInvoice = async () => {
    if (!wallet || !invoiceInput.trim()) {
      return
    }

    setIsPaying(true)
    setScreenError(null)
    setPaymentOperationId(null)

    try {
      const payment = await wallet.lightning.payInvoice(invoiceInput.trim())
      setPaymentOperationId(payment.contract_id)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send payment'
      setScreenError(message)
    } finally {
      setIsPaying(false)
    }
  }

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
              label={isParsing ? 'Parsing...' : 'Parse Invoice'}
              variant="secondary"
              onPress={() => void handleParseInvoice()}
              icon={
                <Feather name="camera" size={18} color={palette.textPrimary} />
              }
            />
            <ActionButton
              label={isPaying ? 'Paying...' : 'Pay Invoice'}
              onPress={() => void handlePayInvoice()}
              icon={<Feather name="arrow-up-right" size={18} color="#FFFFFF" />}
            />
          </View>

          {parseResult ? (
            <View style={styles.previewBox}>
              <Text style={styles.previewLabel}>Parsed Invoice</Text>
              <Text style={styles.previewText}>
                Amount: {parseResult.amount ?? 0} sats
              </Text>
              <Text style={styles.previewText}>
                Memo: {parseResult.memo ?? 'n/a'}
              </Text>
              <Text style={styles.previewText}>
                Expiry: {parseResult.expiry ?? 0} seconds
              </Text>
            </View>
          ) : null}

          {paymentOperationId ? (
            <Text style={styles.successText}>
              Payment operation: {paymentOperationId}
            </Text>
          ) : null}

          {screenError ? (
            <Text style={styles.errorText}>{screenError}</Text>
          ) : null}
        </Panel>

        <Text style={styles.footerNote}>QR scanning is added in Step 5.</Text>
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
  previewBox: {
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.inputBorder,
    backgroundColor: palette.inputBg,
    padding: 10,
    gap: 4,
  },
  previewLabel: {
    color: palette.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  previewText: {
    color: palette.textSecondary,
    fontSize: 14,
  },
  successText: {
    color: palette.success,
    marginTop: 10,
    fontSize: 13,
  },
  errorText: {
    color: palette.danger,
    marginTop: 10,
    fontSize: 13,
  },
  footerNote: {
    color: palette.textSecondary,
    fontSize: 13,
  },
})
