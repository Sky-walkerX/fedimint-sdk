import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ActionButton } from '../../src/components/ActionButton'
import { AppScreen } from '../../src/components/AppScreen'
import { Panel } from '../../src/components/Panel'
import { formatSats } from '../../src/mocks/wallet'
import { useFedimint } from '../../src/hooks/useFedimint'
import { palette } from '../../src/theme/palette'

export default function OverviewScreen() {
  const { wallet, isInitializing, initError } = useFedimint()
  const [balanceMsats, setBalanceMsats] = useState(0)
  const [txCount, setTxCount] = useState(0)
  const [latestOutcome, setLatestOutcome] = useState('n/a')
  const [refreshError, setRefreshError] = useState<string | null>(null)

  const refreshOverview = useCallback(async () => {
    if (!wallet) {
      return
    }

    setRefreshError(null)
    try {
      const [nextBalance, transactions] = await Promise.all([
        wallet.balance.getBalance(),
        wallet.federation.listTransactions(20),
      ])

      setBalanceMsats(nextBalance)
      setTxCount(transactions.length)
      setLatestOutcome(transactions[0]?.outcome ?? 'n/a')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to refresh overview data'
      setRefreshError(message)
    }
  }, [wallet])

  useEffect(() => {
    void refreshOverview()
  }, [refreshOverview])

  const balanceSats = Math.floor(balanceMsats / 1000)

  return (
    <AppScreen>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>Fedimint Wallet</Text>
        <Text style={styles.heading}>Overview</Text>

        <Panel>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>{formatSats(balanceSats)}</Text>
          <Text style={styles.balanceHint}>
            {isInitializing
              ? 'Initializing Fedimint client...'
              : initError
                ? initError
                : refreshError
                  ? refreshError
                  : 'Live data from SDK'}
          </Text>
        </Panel>

        <View style={styles.row}>
          <Panel style={styles.metricPanel}>
            <Text style={styles.metricLabel}>Transactions</Text>
            <Text style={styles.metricValue}>{txCount}</Text>
          </Panel>
          <Panel style={styles.metricPanel}>
            <Text style={styles.metricLabel}>Latest</Text>
            <Text style={styles.metricValue}>{latestOutcome}</Text>
          </Panel>
        </View>

        <View style={styles.actions}>
          <ActionButton
            label="Refresh"
            variant="secondary"
            onPress={() => void refreshOverview()}
            icon={
              <Feather
                color={palette.textPrimary}
                name="refresh-cw"
                size={18}
              />
            }
          />
          <ActionButton
            label="Send"
            onPress={() => router.push('/send')}
            icon={<Feather color="#FFFFFF" name="arrow-up-right" size={18} />}
          />
          <ActionButton
            label="Receive"
            variant="secondary"
            onPress={() => router.push('/receive')}
            icon={
              <Feather
                color={palette.textPrimary}
                name="arrow-down-left"
                size={18}
              />
            }
          />
        </View>
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
  },
  eyebrow: {
    color: palette.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginTop: 6,
  },
  heading: {
    color: palette.textPrimary,
    fontSize: 34,
    fontWeight: '700',
  },
  balanceLabel: {
    color: palette.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  balanceValue: {
    color: palette.textPrimary,
    fontSize: 40,
    fontWeight: '800',
    marginTop: 6,
  },
  balanceHint: {
    color: palette.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  metricPanel: {
    flex: 1,
  },
  metricLabel: {
    color: palette.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  metricValue: {
    color: palette.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  actions: {
    width: '100%',
    gap: 10,
  },
})
