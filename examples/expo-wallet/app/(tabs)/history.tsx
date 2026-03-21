import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { AppScreen } from '../../src/components/AppScreen'
import { Panel } from '../../src/components/Panel'
import { formatSats } from '../../src/mocks/wallet'
import { useFedimint } from '../../src/hooks/useFedimint'
import { palette } from '../../src/theme/palette'
import type { TransactionItem } from '../../src/types/wallet'
import { mapSdkTransactionsToItems } from '../../src/utils/transactions'

export default function HistoryScreen() {
  const { wallet } = useFedimint()
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    if (!wallet) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const sdkTransactions = await wallet.federation.listTransactions(50)
      setTransactions(mapSdkTransactionsToItems(sdkTransactions))
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : 'Failed to load transaction history'
      setError(message)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [wallet])

  useEffect(() => {
    void fetchTransactions()
  }, [fetchTransactions])

  const renderItem = ({ item }: { item: TransactionItem }) => {
    const sign = item.direction === 'incoming' ? '+' : '-'
    const amountColor =
      item.direction === 'incoming' ? palette.success : palette.danger

    return (
      <Panel>
        <View style={styles.itemTopRow}>
          <Text style={styles.itemNote}>{item.note}</Text>
          <Text style={[styles.itemAmount, { color: amountColor }]}>
            {`${sign} ${formatSats(item.amountSats)}`}
          </Text>
        </View>
        <View style={styles.itemBottomRow}>
          <Text style={styles.itemMeta}>{item.timestamp}</Text>
          <Text style={styles.itemMeta}>{item.status}</Text>
        </View>
      </Panel>
    )
  }

  return (
    <AppScreen>
      <View style={styles.container}>
        <Text style={styles.heading}>Transaction History</Text>
        <Text style={styles.subheading}>Recent wallet activity (SDK)</Text>

        {loading ? <Text style={styles.metaText}>Loading...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.metaText}>No transactions available yet.</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
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
  metaText: {
    color: palette.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  errorText: {
    color: palette.danger,
    fontSize: 14,
    marginTop: 2,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  separator: {
    height: 10,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  itemNote: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  itemMeta: {
    textTransform: 'capitalize',
    fontSize: 16,
    color: palette.textSecondary,
  },
})
