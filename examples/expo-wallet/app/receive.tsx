import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { ActionButton } from '../src/components/ActionButton'
import { AppScreen } from '../src/components/AppScreen'
import { useFedimint } from '../src/hooks/useFedimint'
import { Panel } from '../src/components/Panel'
import { palette } from '../src/theme/palette'

export default function ReceiveScreen() {
  const { wallet } = useFedimint()
  const [amountInput, setAmountInput] = useState('21000')
  const [generatedInvoice, setGeneratedInvoice] = useState<string | null>(null)
  const [invoiceOperationId, setInvoiceOperationId] = useState<string | null>(
    null,
  )
  const [screenError, setScreenError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const amountSats = Number.parseInt(amountInput, 10)
  const safeAmountSats =
    Number.isFinite(amountSats) && amountSats > 0 ? amountSats : 0

  const handleGenerateInvoice = async () => {
    if (!wallet || safeAmountSats <= 0) {
      return
    }

    setIsGenerating(true)
    setScreenError(null)
    setGeneratedInvoice(null)
    setInvoiceOperationId(null)

    try {
      const amountMsats = safeAmountSats * 1000
      const response = await wallet.lightning.createInvoice(
        amountMsats,
        'Expo wallet receive',
      )

      setGeneratedInvoice(response.invoice)
      setInvoiceOperationId(response.operation_id)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to generate invoice'
      setScreenError(message)
    } finally {
      setIsGenerating(false)
    }
  }

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
            {generatedInvoice ? (
              <View style={styles.qrCodeCard}>
                <QRCode value={generatedInvoice} size={180} />
              </View>
            ) : (
              <>
                <Feather name="grid" size={70} color={palette.tabInactive} />
                <Text style={styles.qrPlaceholderText}>
                  Generate invoice to render QR
                </Text>
              </>
            )}
          </View>

          <Text style={styles.invoiceLabel}>Generated Invoice</Text>
          <Text numberOfLines={2} style={styles.invoiceText}>
            {generatedInvoice ?? 'No invoice generated yet'}
          </Text>

          {invoiceOperationId ? (
            <Text style={styles.operationText}>
              Operation ID: {invoiceOperationId}
            </Text>
          ) : null}

          {screenError ? (
            <Text style={styles.errorText}>{screenError}</Text>
          ) : null}

          <View style={styles.actionStack}>
            <ActionButton
              label={isGenerating ? 'Generating...' : 'Generate Invoice'}
              onPress={() => void handleGenerateInvoice()}
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
  qrCodeCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
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
  operationText: {
    color: palette.success,
    marginTop: 8,
    fontSize: 12,
  },
  errorText: {
    color: palette.danger,
    marginTop: 8,
    fontSize: 12,
  },
  actionStack: {
    marginTop: 14,
  },
})
