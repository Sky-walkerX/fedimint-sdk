import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { ActionButton } from '../../src/components/ActionButton'
import { AppScreen } from '../../src/components/AppScreen'
import { Panel } from '../../src/components/Panel'
import {
  formatSats,
  mockBalanceSats,
  mockTransactions,
} from '../../src/mocks/wallet'
import { palette } from '../../src/theme/palette'

export default function OverviewScreen() {
  return (
    <AppScreen>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>Fedimint Wallet</Text>
        <Text style={styles.heading}>Overview</Text>

        <Panel>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>{formatSats(mockBalanceSats)}</Text>
          <Text style={styles.balanceHint}>Mock data for UI-only Step 2</Text>
        </Panel>

        <View style={styles.row}>
          <Panel style={styles.metricPanel}>
            <Text style={styles.metricLabel}>Transactions</Text>
            <Text style={styles.metricValue}>{mockTransactions.length}</Text>
          </Panel>
          <Panel style={styles.metricPanel}>
            <Text style={styles.metricLabel}>Latest</Text>
            <Text style={styles.metricValue}>
              {mockTransactions[0]?.status ?? 'n/a'}
            </Text>
          </Panel>
        </View>

        <View style={styles.actions}>
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
