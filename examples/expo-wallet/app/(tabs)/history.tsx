import React, { useCallback, useState } from 'react'
import { View, Text, FlatList, RefreshControl } from 'react-native'
import { wallet } from '../../src/wallet'
import { SectionCard, SectionTitle } from '../../src/components'
import s from '../../src/styles'

type Transaction = {
  txid: string
  txType: string
  amount: number
  timestamp: number
}

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const fetchTransactions = useCallback(async () => {
    setRefreshing(true)
    setError('')
    try {
      if (!wallet || !wallet.isOpen()) {
        setTransactions([])
        return
      }
      const ops = await wallet.federation.listOperations()
      const txList: Transaction[] = (ops ?? []).map((op: any) => ({
        txid: op.id ?? op.operation_id ?? '',
        txType: op.operationType ?? op.operation_type ?? 'unknown',
        amount: op.amount ?? 0,
        timestamp: op.createdAt ?? op.created_at ?? 0,
      }))
      setTransactions(txList)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRefreshing(false)
    }
  }, [])

  const renderItem = ({ item }: { item: Transaction }) => {
    const isIncoming =
      item.txType === 'ln_receive' ||
      item.txType === 'receive' ||
      item.txType === 'mint'
    const sign = isIncoming ? '+' : '-'

    return (
      <View style={s.txItem}>
        <Text style={[s.txType, isIncoming ? s.txIncoming : s.txOutgoing]}>
          {item.txType}
        </Text>
        <Text style={s.txAmount}>
          {sign}
          {item.amount} msats
        </Text>
        {item.timestamp > 0 && (
          <Text style={s.txDate}>
            {new Date(item.timestamp * 1000).toLocaleString()}
          </Text>
        )}
      </View>
    )
  }

  return (
    <View style={s.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.txid}
        renderItem={renderItem}
        contentContainerStyle={[
          s.contentContainer,
          transactions.length === 0 && { flex: 1 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchTransactions}
            tintColor="#60a5fa"
            colors={['#60a5fa']}
          />
        }
        ListHeaderComponent={
          <SectionCard>
            <SectionTitle>Transaction History</SectionTitle>
            <Text style={s.label}>Pull down to refresh</Text>
            {!!error && <Text style={s.errorText}>{error}</Text>}
          </SectionCard>
        }
        ListEmptyComponent={
          <Text style={s.emptyText}>
            No transactions yet. Join a federation and make some payments!
          </Text>
        }
      />
    </View>
  )
}
