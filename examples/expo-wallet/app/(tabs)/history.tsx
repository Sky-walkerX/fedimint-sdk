import React, { useCallback, useState } from 'react'
import { View, Text, FlatList, RefreshControl } from 'react-native'
import { wallet } from '../../src/wallet'
import { SectionCard, SectionTitle } from '../../src/components'
import s from '../../src/styles'
import type { OperationKey, OperationLog } from '@fedimint/core'

type Transaction = {
  operationId: string
  moduleKind: string
  amount: number
  timestamp: number
}

function getVariantLabel(log: OperationLog): string {
  const variant = log.meta?.variant
  if (!variant) return log.operation_module_kind
  if ('pay' in variant && variant.pay) return 'ln_pay'
  if ('receive' in variant && variant.receive) return 'ln_receive'
  if ('spend_o_o_b' in variant && variant.spend_o_o_b) return 'mint_spend'
  if ('reissuance' in variant && variant.reissuance) return 'mint_reissue'
  if ('deposit' in variant && variant.deposit) return 'wallet_deposit'
  if ('withdraw' in variant && variant.withdraw) return 'wallet_withdraw'
  return log.operation_module_kind
}

function isIncomingVariant(label: string): boolean {
  return (
    label === 'ln_receive' ||
    label === 'mint_reissue' ||
    label === 'wallet_deposit'
  )
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
      const ops: [OperationKey, OperationLog][] =
        (await wallet.federation.listOperations()) ?? []
      const txList: Transaction[] = ops.map(([key, log]) => ({
        operationId: key.operation_id,
        moduleKind: getVariantLabel(log),
        amount: log.meta?.amount ?? 0,
        timestamp: key.creation_time?.secs_since_epoch ?? 0,
      }))
      setTransactions(txList)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRefreshing(false)
    }
  }, [])

  const renderItem = ({ item }: { item: Transaction }) => {
    const incoming = isIncomingVariant(item.moduleKind)
    const sign = incoming ? '+' : '-'
    const satsValue = item.amount / 1000
    const satsStr =
      satsValue % 1 === 0
        ? String(Math.floor(satsValue))
        : satsValue.toFixed(3).replace(/0+$/, '')

    return (
      <View style={s.txItem}>
        <Text style={[s.txType, incoming ? s.txIncoming : s.txOutgoing]}>
          {item.moduleKind}
        </Text>
        <Text style={s.txAmount}>
          {sign}
          {satsStr} sats
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
        keyExtractor={(item) => item.operationId}
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
